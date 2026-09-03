import type { FulfillmentStatus, OrderLineItem, OrderRedemption, PaymentStatus } from "./order";

/**
 * What the confirmation page/polling route actually sends to the client —
 * deliberately narrower than Order: no userId, stripeSessionId, or
 * processedStripeEventIds, none of which the client needs once
 * authorizeOrderAccess has already granted access. Also omits
 * pointsAwardedAt/pointsEarned — internal bookkeeping only.
 */
export interface OrderSummaryDTO {
  id: string;
  lineItems: OrderLineItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus | null;
  redemption: OrderRedemption | null;
  createdAt: number;
}
