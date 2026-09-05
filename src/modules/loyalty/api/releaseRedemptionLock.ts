import { FieldValue, type Transaction } from "firebase-admin/firestore";
import { AUTH_COLLECTIONS } from "@/modules/auth/lib/collections";
import { toUser } from "@/modules/auth/lib/toUser";
import { adminDb } from "@/shared/lib/firebase-admin";

/**
 * Clears User.activeRedemptionOrderId within an already-open transaction,
 * but only if it currently points at this exact order — guards against
 * clearing a newer lock a since-started checkout may have already
 * claimed. Called whenever a redemption-carrying order resolves (Paid or
 * Failed), so the user isn't left permanently unable to redeem again.
 */
export async function releaseRedemptionLock(tx: Transaction, userId: string, orderId: string): Promise<void> {
  const userRef = adminDb.collection(AUTH_COLLECTIONS.users).doc(userId);
  const userSnap = await tx.get(userRef);
  if (!userSnap.exists) return;

  const user = toUser(userSnap);
  if (user.activeRedemptionOrderId !== orderId) return;

  tx.update(userRef, { activeRedemptionOrderId: null, updatedAt: FieldValue.serverTimestamp() });
}
