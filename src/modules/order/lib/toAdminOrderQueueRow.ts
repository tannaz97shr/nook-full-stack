import { formatMoney } from "@/shared/utils/format-money";
import { formatOrderTaxLine, formatRedemptionLine } from "../content/orderStatusContent";
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
  /** Tax and redemption lines under the total, e.g. ["Tax $0.36", "Free drip coffee −$3.96"] — may be empty. */
  subLineParts: string[];
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus | null;
}

/** A legacy "Tax $0.00" says nothing, so it's dropped; the redemption explains totals like $0.00. */
function subLineParts(order: Order): string[] {
  const parts: string[] = [];
  const isZeroLegacyTax = order.pricing.kind === "legacy-tax-added" && order.pricing.tax === 0;
  if (!isZeroLegacyTax) parts.push(formatOrderTaxLine(order.pricing));
  if (order.redemption) parts.push(formatRedemptionLine(order.redemption));
  return parts;
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
    subLineParts: subLineParts(order),
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
  };
}
