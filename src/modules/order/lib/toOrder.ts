import type { DocumentData, DocumentSnapshot } from "firebase-admin/firestore";
import type { Order, OrderPricing } from "../types/order";

/** New orders store gstIncluded; orders placed before GST-inclusive pricing store tax instead and are never migrated. */
function toOrderPricing(data: DocumentData): OrderPricing {
  if (typeof data.gstIncluded === "number") {
    return { kind: "gst-inclusive", gstIncluded: data.gstIncluded };
  }
  return { kind: "legacy-tax-added", tax: data.tax };
}

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
    pricing: toOrderPricing(data),
    shipping: data.shipping,
    total: data.total,
    paymentStatus: data.paymentStatus,
    fulfillmentStatus: data.fulfillmentStatus,
    stripeSessionId: data.stripeSessionId,
    processedStripeEventIds: data.processedStripeEventIds,
    redemption: data.redemption ?? null,
    pointsAwardedAt: data.pointsAwardedAt?.toMillis() ?? null,
    pointsEarned: data.pointsEarned ?? null,
    isDemo: data.isDemo ?? false,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
