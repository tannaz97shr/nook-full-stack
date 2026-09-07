import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/shared/lib/firebase-admin";
import { FULFILLMENT_STATUS_STEPS } from "../content/orderStatusContent";
import { ORDER_COLLECTIONS } from "../lib/collections";
import { toOrder } from "../lib/toOrder";
import type { FulfillmentStatus } from "../types/order";

export type AdvanceFulfillmentStatusResult =
  | "advanced"
  | "already-at-target"
  | "not-found"
  | "not-paid"
  | "invalid-transition";

/**
 * Received->Preparing and Preparing->Ready only — Completed goes through
 * awardPointsIfCompleted instead, since that transition also credits
 * points transactionally. Sequential-only: the valid next status is
 * derived from FULFILLMENT_STATUS_STEPS' index rather than a second
 * hardcoded sequence, matching the design mock's single "-> NextStatus"
 * button (no skip-ahead, no regression).
 */
export async function advanceFulfillmentStatus(
  orderId: string,
  target: Extract<FulfillmentStatus, "Preparing" | "Ready">,
): Promise<AdvanceFulfillmentStatusResult> {
  const ref = adminDb.collection(ORDER_COLLECTIONS.orders).doc(orderId);

  return adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return "not-found";

    const order = toOrder(snap);
    if (order.paymentStatus !== "Paid") return "not-paid";
    if (order.fulfillmentStatus === target) return "already-at-target";

    const currentIndex = FULFILLMENT_STATUS_STEPS.findIndex((step) => step.status === order.fulfillmentStatus);
    const targetIndex = FULFILLMENT_STATUS_STEPS.findIndex((step) => step.status === target);
    if (targetIndex !== currentIndex + 1) return "invalid-transition";

    tx.update(ref, { fulfillmentStatus: target, updatedAt: FieldValue.serverTimestamp() });
    return "advanced";
  });
}
