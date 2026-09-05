import { FieldValue } from "firebase-admin/firestore";
import { AUTH_COLLECTIONS } from "@/modules/auth/lib/collections";
import { toUser } from "@/modules/auth/lib/toUser";
import { ORDER_COLLECTIONS } from "@/modules/order/lib/collections";
import { toOrder } from "@/modules/order/lib/toOrder";
import type { CreatePendingOrderInput } from "@/modules/order/api/createPendingOrder";
import type { OrderRedemption } from "@/modules/order/types/order";
import { adminDb } from "@/shared/lib/firebase-admin";

// Well under Stripe's 24h Checkout Session expiry — long enough for a real checkout attempt, short enough that an abandoned one doesn't lock a user out for long.
const STALE_LOCK_MS = 30 * 60 * 1000;

export type ReserveRedemptionResult = { ok: true; orderId: string } | { ok: false; reason: string };

/**
 * Atomically claims a single-flight redemption lock on the user doc in
 * the SAME transaction that creates the order — this is what actually
 * prevents two concurrent checkout requests from both redeeming a reward
 * the balance only supports once (verifyRedemption's earlier check is a
 * plain read and can't do this alone; this transaction re-checks the
 * balance authoritatively as the final race-safe gate). The loser of a
 * true race either sees the lock already held and is rejected outright,
 * or loses Firestore's optimistic-concurrency retry and re-reads the
 * now-updated user doc, landing in the same rejected branch.
 *
 * Used only when a reward is being redeemed — the no-reward path keeps
 * using the simpler, non-transactional createPendingOrder.
 */
export async function reserveRedemptionOrder(
  userId: string,
  redemption: OrderRedemption,
  orderData: Omit<CreatePendingOrderInput, "userId">,
): Promise<ReserveRedemptionResult> {
  const userRef = adminDb.collection(AUTH_COLLECTIONS.users).doc(userId);
  const orderRef = adminDb.collection(ORDER_COLLECTIONS.orders).doc();

  return adminDb.runTransaction(async (tx) => {
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) {
      return { ok: false, reason: "Account not found" };
    }
    const user = toUser(userSnap);

    if (user.pointsBalance < redemption.pointsCost) {
      return { ok: false, reason: "Not enough points for that reward" };
    }

    if (user.activeRedemptionOrderId !== null) {
      const heldRef = adminDb.collection(ORDER_COLLECTIONS.orders).doc(user.activeRedemptionOrderId);
      const heldSnap = await tx.get(heldRef); // read before any write
      const held = heldSnap.exists ? toOrder(heldSnap) : null;
      const stale = !held || held.paymentStatus !== "Pending" || Date.now() - held.createdAt > STALE_LOCK_MS;
      if (!stale) {
        return { ok: false, reason: "You already have a reward pending checkout — finish or try again shortly" };
      }
    }

    const now = FieldValue.serverTimestamp();
    tx.set(orderRef, {
      userId,
      lineItems: orderData.lineItems,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      shipping: orderData.shipping,
      total: orderData.total,
      paymentStatus: "Pending",
      fulfillmentStatus: null,
      stripeSessionId: null,
      processedStripeEventIds: [],
      redemption,
      pointsAwardedAt: null,
      pointsEarned: null,
      createdAt: now,
      updatedAt: now,
    });
    tx.update(userRef, { activeRedemptionOrderId: orderRef.id, updatedAt: now });

    return { ok: true, orderId: orderRef.id };
  });
}
