import type { FulfillmentStatus, PaymentStatus } from "../types/order";
import type { OrderSummaryDTO } from "../types/order-summary-dto";

export const ORDER_CONFIRMATION_HEADING = "Order confirmed";
export const ORDER_NOT_FOUND_HEADING = "Order not found";
export const ORDER_NOT_FOUND_COPY = "We couldn't find that order. Check the link and try again.";

/** The 4-stage customer-facing pipeline, matching design/Nook-standalone-src.dc.html's status copy. */
export const FULFILLMENT_STATUS_STEPS: { status: FulfillmentStatus; label: string; note: string }[] = [
  { status: "Received", label: "Received", note: "Payment confirmed, ticket printed" },
  { status: "Preparing", label: "Preparing", note: "On the bar and in the kitchen" },
  { status: "Ready", label: "Ready", note: "Waiting at the pickup end of the counter" },
  { status: "Completed", label: "Completed", note: "Collected" },
];

/** Copy for the states before FulfillmentStatus applies (i.e. paymentStatus isn't "Paid" yet). */
export function pendingPaymentStatusCopy(paymentStatus: PaymentStatus): string {
  switch (paymentStatus) {
    case "Pending":
      return "Confirming your payment…";
    case "Failed":
      return "Payment failed — please try again.";
    case "Cancelled":
      return "This order was cancelled.";
    case "Paid":
      return "";
  }
}

export type OrderStatusChipTone = "leaf" | "clay" | "neutral";

/** Compact status chip for order-history list rows — distinct from the confirmation page's step tracker. */
export function orderHistoryChipLabel(
  order: Pick<OrderSummaryDTO, "paymentStatus" | "fulfillmentStatus">,
): { label: string; tone: OrderStatusChipTone } {
  switch (order.paymentStatus) {
    case "Pending":
      return { label: "Payment pending", tone: "clay" };
    case "Failed":
      return { label: "Payment failed", tone: "clay" };
    case "Cancelled":
      return { label: "Cancelled", tone: "neutral" };
    case "Paid":
      if (order.fulfillmentStatus === "Completed") {
        return { label: "Completed", tone: "leaf" };
      }
      return {
        label: FULFILLMENT_STATUS_STEPS.find((step) => step.status === order.fulfillmentStatus)?.label ?? "Received",
        tone: "clay",
      };
  }
}
