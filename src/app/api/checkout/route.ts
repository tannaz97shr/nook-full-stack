import { getOptionalSession } from "@/modules/auth/lib/getOptionalSession";
import { reserveRedemptionOrder } from "@/modules/loyalty/api/reserveRedemptionOrder";
import { verifyRedemption } from "@/modules/loyalty/lib/verifyRedemption";
import {
  attachStripeSessionId,
  createPendingOrder,
  markOrderFailed,
} from "@/modules/order/api";
import { checkoutRequestSchema } from "@/modules/order/lib/checkoutRequestSchema";
import { SHIPPING_FLAT, TAX_RATE } from "@/modules/order/lib/pricingConstants";
import { reverifyOrderLines } from "@/modules/order/lib/reverifyOrderLines";
import { ROUTES } from "@/shared/routes";
import { stripe } from "@/shared/lib/stripe";
import { roundToCents } from "@/shared/utils/format-money";
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

  const tax = roundToCents(result.subtotal * TAX_RATE);
  const shipping = SHIPPING_FLAT;
  const preDiscountTotal = roundToCents(result.subtotal + tax + shipping);

  const redemptionResult = await verifyRedemption(parsed.data.rewardId, sessionUser, preDiscountTotal);
  if (!redemptionResult.ok) {
    return Response.json({ error: redemptionResult.reason }, { status: 400 });
  }
  const redemption = redemptionResult.redemption;
  const total = roundToCents(preDiscountTotal - (redemption?.discountAmount ?? 0));

  const orderData = { lineItems: result.lines, subtotal: result.subtotal, tax, shipping, total };

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
        amount_off: Math.round(redemption.discountAmount * 100),
        currency: "usd",
        duration: "once",
        name: `Reward: ${redemption.rewardId}`,
      });
      discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        ...result.lines.map((line) => ({
          price_data: {
            currency: "usd",
            product_data: { name: line.name },
            unit_amount: Math.round(line.unitPrice * 100),
          },
          quantity: line.quantity,
        })),
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Tax" },
            unit_amount: Math.round(tax * 100),
          },
          quantity: 1,
        },
      ],
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
