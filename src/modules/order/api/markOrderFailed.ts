import { FieldValue } from "firebase-admin/firestore";
import { releaseRedemptionLock } from "@/modules/loyalty/api/releaseRedemptionLock";
import { adminDb } from "@/shared/lib/firebase-admin";
import { ORDER_COLLECTIONS } from "../lib/collections";
import { toOrder } from "../lib/toOrder";

/**
 * Marks an order Failed when Stripe Checkout Session creation itself
 * throws — never leaves it orphaned as Pending. If the order had reserved
 * a reward redemption, also releases the user's single-flight redemption
 * lock so a failed checkout attempt doesn't permanently block them from
 * redeeming again (no points were ever deducted for this order, so there's
 * nothing to refund — only the lock needs clearing).
 */
export async function markOrderFailed(orderId: string): Promise<void> {
  const ref = adminDb.collection(ORDER_COLLECTIONS.orders).doc(orderId);

  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return;

    const order = toOrder(snap);
    if (order.redemption !== null && order.userId !== null) {
      await releaseRedemptionLock(tx, order.userId, order.id); // read+write user, before the order write below
    }

    tx.update(ref, { paymentStatus: "Failed", updatedAt: FieldValue.serverTimestamp() });
  });
}
