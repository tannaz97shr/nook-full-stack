import { FieldValue, type Transaction } from "firebase-admin/firestore";
import { AUTH_COLLECTIONS } from "@/modules/auth/lib/collections";
import { toUser } from "@/modules/auth/lib/toUser";
import { adminDb } from "@/shared/lib/firebase-admin";

/**
 * Reads and decrements a user's pointsBalance within an already-open
 * transaction, and clears the redemption lock in the same update — called
 * from markOrderPaidIfUnprocessed so the deduction rides that function's
 * exactly-once guard (processedStripeEventIds) and only ever fires from a
 * real Stripe webhook delivery, never at order-creation/selection time.
 * A single read + single write to the user doc (not two separate writes)
 * since Firestore transactions don't support issuing more than one write
 * to the same document reference. Floors the balance at 0 defensively —
 * the reservation lock in reserveRedemptionOrder is what actually
 * prevents this from being needed, but the floor stays as a second layer
 * of safety.
 */
export async function deductRedeemedPoints(
  tx: Transaction,
  userId: string,
  orderId: string,
  pointsCost: number,
): Promise<void> {
  const userRef = adminDb.collection(AUTH_COLLECTIONS.users).doc(userId);
  const userSnap = await tx.get(userRef);
  if (!userSnap.exists) return;

  const user = toUser(userSnap);
  tx.update(userRef, {
    pointsBalance: Math.max(0, user.pointsBalance - pointsCost),
    activeRedemptionOrderId: user.activeRedemptionOrderId === orderId ? null : user.activeRedemptionOrderId,
    updatedAt: FieldValue.serverTimestamp(),
  });
}
