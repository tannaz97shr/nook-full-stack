import Stripe from "stripe";
import { markOrderPaidIfUnprocessed } from "@/modules/order/api";
import { stripe } from "@/shared/lib/stripe";
import { logError } from "@/shared/utils/log-error";

// Firebase Admin SDK requires Node APIs, not Edge.
export const runtime = "nodejs";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  // Raw body, not req.json() — Stripe's signature is computed over the
  // exact bytes; parsing-then-restringifying can silently break it.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    logError(error, "webhooks.stripe.verify", { level: "warn" });
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      logError(new Error("checkout.session.completed with no metadata.orderId"), "webhooks.stripe", {
        level: "warn",
      });
      return Response.json({ received: true });
    }

    try {
      const result = await markOrderPaidIfUnprocessed(orderId, event.id);
      if (result === "not-found") {
        logError(new Error(`Order ${orderId} not found for event ${event.id}`), "webhooks.stripe", {
          level: "warn",
        });
      }
    } catch (error) {
      // Surface the failure instead of letting it propagate uncaught —
      // an uncaught throw here still returns a non-200 today, but
      // silently, with no logged cause and no distinction from any
      // other failure. Returning a real error status is what makes
      // Stripe's own automatic retry a deliberate safety net for
      // transient failures (e.g. transaction contention) rather than
      // stranding the order in "Pending" forever.
      logError(error, "webhooks.stripe.markPaid", { level: "error" });
      return Response.json({ error: "Failed to process order" }, { status: 500 });
    }
  }

  // Other event types (e.g. checkout.session.expired) are acknowledged
  // but not yet handled — see specs/known-issues.md.
  return Response.json({ received: true });
}
