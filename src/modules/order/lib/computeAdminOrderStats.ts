import { formatMoney } from "@/shared/utils/format-money";
import type { Order } from "../types/order";

export interface AdminOrderStats {
  inQueueCount: number;
  readyForPickupCount: number;
  doneTodayLabel: string;
  takingsTodayLabel: string;
}

function isToday(millis: number): boolean {
  return new Date().toDateString() === new Date(millis).toDateString();
}

/**
 * "Done today"/"Takings" use updatedAt as a completed-at proxy — Order has
 * no dedicated completedAt field, and pointsAwardedAt is null for guest
 * orders (awardPointsIfCompleted's guest branch never sets it), so it
 * can't serve this purpose for every order. updatedAt is bumped on every
 * write, including the guest-completion branch, and Completed is terminal
 * (nothing writes to a Completed order again), so it's a safe proxy here.
 */
export function computeAdminOrderStats(orders: Order[]): AdminOrderStats {
  const paid = orders.filter((order) => order.paymentStatus === "Paid");
  const inQueueCount = paid.filter(
    (order) => order.fulfillmentStatus === "Received" || order.fulfillmentStatus === "Preparing",
  ).length;
  const readyForPickupCount = paid.filter((order) => order.fulfillmentStatus === "Ready").length;
  const completedToday = paid.filter((order) => order.fulfillmentStatus === "Completed" && isToday(order.updatedAt));

  return {
    inQueueCount,
    readyForPickupCount,
    doneTodayLabel: String(completedToday.length),
    takingsTodayLabel: formatMoney(completedToday.reduce((sum, order) => sum + order.total, 0)),
  };
}
