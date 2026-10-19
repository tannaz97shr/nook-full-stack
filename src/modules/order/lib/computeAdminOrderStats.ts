import { isSameCafeDay } from "@/shared/utils/date";
import { formatMoney } from "@/shared/utils/format-money";
import type { Order } from "../types/order";

export interface AdminOrderStats {
  inQueueCount: number;
  readyForPickupCount: number;
  doneTodayLabel: string;
  takingsTodayLabel: string;
}

/** "Today" is the Melbourne calendar day — the server runs on UTC, which would roll over at 10–11am. */
function isToday(millis: number, now: Date): boolean {
  return isSameCafeDay(new Date(millis), now);
}

/**
 * "Done today"/"Takings" use updatedAt as a completed-at proxy — Order has
 * no dedicated completedAt field, and pointsAwardedAt is null for guest
 * orders (awardPointsIfCompleted's guest branch never sets it), so it
 * can't serve this purpose for every order. updatedAt is bumped on every
 * write, including the guest-completion branch, and Completed is terminal
 * (nothing writes to a Completed order again), so it's a safe proxy here.
 */
export function computeAdminOrderStats(orders: Order[], now: Date = new Date()): AdminOrderStats {
  const paid = orders.filter((order) => order.paymentStatus === "Paid");
  const inQueueCount = paid.filter(
    (order) => order.fulfillmentStatus === "Received" || order.fulfillmentStatus === "Preparing",
  ).length;
  const readyForPickupCount = paid.filter((order) => order.fulfillmentStatus === "Ready").length;
  const completedToday = paid.filter((order) => order.fulfillmentStatus === "Completed" && isToday(order.updatedAt, now));

  return {
    inQueueCount,
    readyForPickupCount,
    doneTodayLabel: String(completedToday.length),
    takingsTodayLabel: formatMoney(completedToday.reduce((sum, order) => sum + order.total, 0)),
  };
}
