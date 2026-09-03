import type { DocumentSnapshot } from "firebase-admin/firestore";
import type { Order } from "../types/order";

export function toOrder(doc: DocumentSnapshot): Order {
  const data = doc.data();
  if (!data) {
    throw new Error(`Order document ${doc.id} does not exist`);
  }

  return {
    id: doc.id,
    userId: data.userId,
    lineItems: data.lineItems,
    subtotal: data.subtotal,
    tax: data.tax,
    shipping: data.shipping,
    total: data.total,
    paymentStatus: data.paymentStatus,
    fulfillmentStatus: data.fulfillmentStatus,
    stripeSessionId: data.stripeSessionId,
    processedStripeEventIds: data.processedStripeEventIds,
    redemption: data.redemption ?? null,
    pointsAwardedAt: data.pointsAwardedAt?.toMillis() ?? null,
    pointsEarned: data.pointsEarned ?? null,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
