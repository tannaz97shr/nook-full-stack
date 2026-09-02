import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/shared/lib/firebase-admin";
import { ORDER_COLLECTIONS } from "../lib/collections";

export type MarkOrderPaidResult = "paid" | "already-processed" | "not-found";

/**
 * Webhook idempotency: the transaction reads processedStripeEventIds and
 * only writes if this exact eventId hasn't been seen, so concurrent
 * redeliveries of the same event can't double-apply. arrayUnion is itself
 * idempotent too, as a second layer of safety.
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

    const data = snap.data();
    const processedStripeEventIds: string[] = data?.processedStripeEventIds ?? [];
    if (processedStripeEventIds.includes(eventId)) {
      return "already-processed";
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
