import type { Order } from "../types/order";
import type { OrderSummaryDTO } from "../types/order-summary-dto";

export function toOrderSummaryDTO(order: Order): OrderSummaryDTO {
  return {
    id: order.id,
    lineItems: order.lineItems,
    subtotal: order.subtotal,
    tax: order.tax,
    shipping: order.shipping,
    total: order.total,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    createdAt: order.createdAt,
  };
}
