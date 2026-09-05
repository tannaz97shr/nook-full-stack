import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/shared/lib/firebase-admin";
import { ORDER_COLLECTIONS } from "../lib/collections";
import type { OrderLineItem } from "../types/order";

export interface CreatePendingOrderInput {
  userId: string | null;
  lineItems: OrderLineItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

/**
 * Creates the order doc with its own Firestore-generated ID BEFORE the
 * Stripe Checkout Session exists (order id can't be the session id — see
 * authorizeOrderAccess.ts). Returns the new order id so the caller can
 * create the Stripe session and then attachStripeSessionId.
 *
 * Only for the no-redemption path — an order that redeems a reward is
 * created via loyalty/api/reserveRedemptionOrder.ts instead, which needs
 * the same field shape inside an atomic transaction with the user's
 * points lock. redemption/pointsAwardedAt/pointsEarned are always present
 * on every order doc (this path just sets the first to null).
 */
export async function createPendingOrder(input: CreatePendingOrderInput): Promise<string> {
  const ref = adminDb.collection(ORDER_COLLECTIONS.orders).doc();

  await ref.set({
    userId: input.userId,
    lineItems: input.lineItems,
    subtotal: input.subtotal,
    tax: input.tax,
    shipping: input.shipping,
    total: input.total,
    paymentStatus: "Pending",
    fulfillmentStatus: null,
    stripeSessionId: null,
    processedStripeEventIds: [],
    redemption: null,
    pointsAwardedAt: null,
    pointsEarned: null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return ref.id;
}
