import { formatMoney } from "@/shared/utils/format-money";
import type { FulfillmentStatus, Order, PaymentStatus } from "../types/order";
import { formatOrderDisplayId } from "./formatOrderDisplayId";
import { formatOrderQueueTimestamp } from "./formatOrderQueueTimestamp";
import { formatOrderSummaryLine } from "./formatOrderSummaryLine";

export interface AdminOrderQueueRow {
  id: string;
  displayId: string;
  customerLabel: string;
  timeLabel: string;
  itemsSummary: string;
  totalLabel: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus | null;
}

/**
 * Takes the already-resolved customer name (or null for guest/unresolved)
 * — the mapper stays Firestore-free/pure; joining Order.userId against the
 * batch-fetched Users map happens once in page.tsx.
 */
export function toAdminOrderQueueRow(order: Order, customerName: string | null): AdminOrderQueueRow {
  return {
    id: order.id,
    displayId: formatOrderDisplayId(order.id),
    customerLabel: order.userId === null ? "Guest" : (customerName ?? order.userId),
    timeLabel: formatOrderQueueTimestamp(order.createdAt),
    itemsSummary: formatOrderSummaryLine(order.lineItems),
    totalLabel: formatMoney(order.total),
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
  };
}
