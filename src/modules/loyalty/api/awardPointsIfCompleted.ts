import { FieldValue } from "firebase-admin/firestore";
import { AUTH_COLLECTIONS } from "@/modules/auth/lib/collections";
import { toUser } from "@/modules/auth/lib/toUser";
import { ORDER_COLLECTIONS } from "@/modules/order/lib/collections";
import { toOrder } from "@/modules/order/lib/toOrder";
import { adminDb } from "@/shared/lib/firebase-admin";
import { pointsForOrder } from "../lib/pointsForOrder";

export type AwardPointsResult = "awarded" | "already-awarded" | "not-found" | "guest-order" | "not-paid";

/**
 * Transactionally transitions an order to fulfillmentStatus "Completed"
 * and, in the same transaction, credits the owning user's pointsBalance.
 * Mirrors markOrderPaidIfUnprocessed's read-check-write idiom; the
 * idempotency guard here is the scalar pointsAwardedAt (there's exactly
 * one Completed transition per order, unlike a redeliverable webhook
 * event, so a scalar "has this fired" marker is sufficient).
 *
 * Points are earned on the amount actually paid (order.total, after any
 * reward) — see pointsForOrder for the rule and its legacy-order case.
 */
export async function awardPointsIfCompleted(orderId: string): Promise<AwardPointsResult> {
  const orderRef = adminDb.collection(ORDER_COLLECTIONS.orders).doc(orderId);

  return adminDb.runTransaction(async (tx) => {
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) return "not-found";

    const order = toOrder(orderSnap);
    if (order.pointsAwardedAt !== null) return "already-awarded";
    if (order.paymentStatus !== "Paid") return "not-paid";

    const now = FieldValue.serverTimestamp();

    if (order.userId === null) {
      tx.update(orderRef, { fulfillmentStatus: "Completed", updatedAt: now });
      return "guest-order";
    }

    const userRef = adminDb.collection(AUTH_COLLECTIONS.users).doc(order.userId);
    const userSnap = await tx.get(userRef); // all reads before any writes

    if (!userSnap.exists) {
      tx.update(orderRef, { fulfillmentStatus: "Completed", updatedAt: now });
      return "not-found";
    }

    const user = toUser(userSnap);
    const pointsEarned = pointsForOrder(order);

    tx.update(orderRef, {
      fulfillmentStatus: "Completed",
      pointsAwardedAt: now,
      pointsEarned,
      updatedAt: now,
    });
    tx.update(userRef, { pointsBalance: user.pointsBalance + pointsEarned, updatedAt: now });

    return "awarded";
  });
}
