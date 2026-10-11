import { getOptionalSession } from "@/modules/auth/lib/getOptionalSession";
import { reserveRedemptionOrder } from "@/modules/loyalty/api/reserveRedemptionOrder";
import { verifyRedemption } from "@/modules/loyalty/lib/verifyRedemption";
import {
  attachStripeSessionId,
  createPendingOrder,
  markOrderFailed,
} from "@/modules/order/api";
import { checkoutRequestSchema } from "@/modules/order/lib/checkoutRequestSchema";
import { computeOrderTotals, toCents } from "@/modules/order/lib/gst";
import { SHIPPING_FLAT } from "@/modules/order/lib/pricingConstants";
import { reverifyOrderLines } from "@/modules/order/lib/reverifyOrderLines";
import { ROUTES } from "@/shared/routes";
import { stripe } from "@/shared/lib/stripe";
import { logError } from "@/shared/utils/log-error";

export async function POST(req: Request) {
  const sessionUser = await getOptionalSession();

  const body = await req.json();
  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid checkout request" }, { status: 400 });
  }

  const result = await reverifyOrderLines(parsed.data.lines);
  if (!result.ok) {
    return Response.json({ error: result.reason }, { status: 400 });
  }

  // Menu prices are GST-inclusive, so the pre-discount total IS the subtotal — nothing is added on top.
  const redemptionResult = await verifyRedemption(parsed.data.rewardId, sessionUser, result.subtotal);
  if (!redemptionResult.ok) {
    return Response.json({ error: redemptionResult.reason }, { status: 400 });
  }
  const redemption = redemptionResult.redemption;
  const { total, gstIncluded } = computeOrderTotals({
    subtotal: result.subtotal,
    discountAmount: redemption?.discountAmount ?? 0,
  });

  // Stripe charges Σ(unit_amount × quantity) − coupon, all in cents. Refuse before creating anything if that could ever differ from the total we store and display.
  const stripeLineCents = result.lines.reduce((sum, line) => sum + toCents(line.unitPrice) * line.quantity, 0);
  const stripeCouponCents = redemption ? toCents(redemption.discountAmount) : 0;
  if (stripeLineCents - stripeCouponCents !== toCents(total)) {
    logError(
      new Error(`Stripe amount ${stripeLineCents - stripeCouponCents}c != order total ${toCents(total)}c`),
      "checkout.amountMismatch",
      { level: "error" },
    );
    return Response.json({ error: "Could not start checkout" }, { status: 500 });
  }

  const orderData = { lineItems: result.lines, subtotal: result.subtotal, gstIncluded, shipping: SHIPPING_FLAT, total };

  let orderId: string;
  if (redemption === null) {
    orderId = await createPendingOrder({ userId: sessionUser?.id ?? null, ...orderData });
  } else if (sessionUser === null) {
    // Unreachable: verifyRedemption always rejects a null sessionUser before returning a non-null redemption. Narrows the type instead of asserting it.
    return Response.json({ error: "Sign in to redeem a reward" }, { status: 400 });
  } else {
    const reserved = await reserveRedemptionOrder(sessionUser.id, redemption, orderData);
    if (!reserved.ok) {
      return Response.json({ error: reserved.reason }, { status: 409 });
    }
    orderId = reserved.orderId;
  }

  try {
    const origin = new URL(req.url).origin;

    // A fresh, one-time-use Coupon sized to our own pre-capped discountAmount (never the catalog's raw face value) — Stripe doesn't support negative line items, and a persistent multi-use coupon per reward couldn't be capped correctly for small orders where discountValue > preDiscountTotal.
    let discounts: { coupon: string }[] | undefined;
    if (redemption && redemption.discountAmount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: stripeCouponCents,
        currency: "usd",
        duration: "once",
        name: `Reward: ${redemption.rewardId}`,
      });
      discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // GST-inclusive unit prices — no separate tax line item.
      line_items: result.lines.map((line) => ({
        price_data: {
          currency: "usd",
          product_data: { name: line.name },
          unit_amount: toCents(line.unitPrice),
        },
        quantity: line.quantity,
      })),
      discounts,
      metadata: { orderId },
      success_url: `${origin}${ROUTES.orderConfirmation(orderId)}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${ROUTES.menu}`,
    });

    await attachStripeSessionId(orderId, session.id);

    return Response.json({ url: session.url });
  } catch (error) {
    logError(error, "checkout.createSession", { level: "error" });
    await markOrderFailed(orderId);
    return Response.json({ error: "Could not start checkout" }, { status: 502 });
  }
}
