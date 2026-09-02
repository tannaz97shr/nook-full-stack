import { getOptionalSession } from "@/modules/auth/lib/getOptionalSession";
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
  const total = roundToCents(result.subtotal + tax + shipping);

  const orderId = await createPendingOrder({
    userId: sessionUser?.id ?? null,
    lineItems: result.lines,
    subtotal: result.subtotal,
    tax,
    shipping,
    total,
  });

  try {
    const origin = new URL(req.url).origin;
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
