import type { FulfillmentStatus } from "../types/order";

export const ADMIN_ORDER_QUEUE_HEADING = "Order queue";
export const ADMIN_ORDER_QUEUE_SUBHEADING = "Advance paid orders through fulfillment.";

export type AdminOrderQueueTabId = "all" | "Received" | "Preparing" | "Ready" | "Completed";

export const ADMIN_ORDER_QUEUE_TABS: { id: AdminOrderQueueTabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Received", label: "Received" },
  { id: "Preparing", label: "Preparing" },
  { id: "Ready", label: "Ready" },
  { id: "Completed", label: "Completed" },
];

export const ADMIN_ORDER_STAT_LABELS = {
  inQueue: "In queue",
  readyForPickup: "Ready for pickup",
  doneToday: "Done today",
  takings: "Takings",
};

export const ADMIN_ORDER_QUEUE_COLUMNS = ["Order", "Items", "Total", "Status"];
export const ADMIN_ORDER_QUEUE_EMPTY_COPY = "No orders match this filter.";
export const ORDER_STATUS_ADVANCE_ERROR = "Couldn't update order status — try again";

export function adminOrderStatusChipVariant(status: FulfillmentStatus | null): "clay" | "gold" | "leaf" | "neutral" {
  switch (status) {
    case "Received":
      return "clay";
    case "Preparing":
      return "gold";
    case "Ready":
      return "leaf";
    case "Completed":
    default:
      return "neutral";
  }
}
