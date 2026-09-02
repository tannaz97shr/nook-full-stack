import type { FulfillmentStatus, PaymentStatus } from "../types/order";

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
