import { FieldValue } from "firebase-admin/firestore";
import { deductRedeemedPoints } from "@/modules/loyalty/api/deductRedeemedPoints";
import { adminDb } from "@/shared/lib/firebase-admin";
import { ORDER_COLLECTIONS } from "../lib/collections";
import { toOrder } from "../lib/toOrder";

export type MarkOrderPaidResult = "paid" | "already-processed" | "not-found";

/**
 * Webhook idempotency: the transaction reads processedStripeEventIds and
 * only writes if this exact eventId hasn't been seen, so concurrent
 * redeliveries of the same event can't double-apply. arrayUnion is itself
 * idempotent too, as a second layer of safety.
 *
 * If this order redeemed a reward, the points deduction (and clearing the
 * user's redemption lock) rides this same exactly-once guard — it only
 * ever runs once, only from a real Stripe webhook delivery, never at
 * order-creation/selection time, and never for an abandoned checkout
 * (this function is simply never called for one, since no
 * checkout.session.completed event ever arrives).
 */
export async function markOrderPaidIfUnprocessed(
  orderId: string,
  eventId: string,
): Promise<MarkOrderPaidResult> {
  const ref = adminDb.collection(ORDER_COLLECTIONS.orders).doc(orderId);

  return adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      return "not-found";
    }

    const order = toOrder(snap);
    if (order.processedStripeEventIds.includes(eventId)) {
      return "already-processed";
    }

    if (order.redemption !== null && order.userId !== null) {
      await deductRedeemedPoints(tx, order.userId, order.id, order.redemption.pointsCost); // read+write user, still before the order write below
    }

    tx.update(ref, {
      paymentStatus: "Paid",
      fulfillmentStatus: "Received",
      processedStripeEventIds: FieldValue.arrayUnion(eventId),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return "paid";
  });
}
