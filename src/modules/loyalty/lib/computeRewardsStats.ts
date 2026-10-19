import type { Order } from "@/modules/order/types/order";
import { toCafeYear } from "@/shared/utils/date";

export interface RewardsStats {
  earnedThisYear: number;
  redeemed: number;
}

export function computeRewardsStats(orders: Order[], now: Date = new Date()): RewardsStats {
  // Melbourne calendar year, not the server's UTC year — they differ for ~11 hours around New Year.
  const currentYear = toCafeYear(now);

  const earnedThisYear = orders
    .filter((order) => order.pointsAwardedAt !== null && toCafeYear(new Date(order.pointsAwardedAt)) === currentYear)
    .reduce((sum, order) => sum + (order.pointsEarned ?? 0), 0);

  const redeemed = orders
    // Only orders that actually reached Paid ever had points deducted (see markOrderPaidIfUnprocessed) — a Pending/Failed redemption intent never counts.
    .filter((order) => order.redemption !== null && order.paymentStatus === "Paid")
    .reduce((sum, order) => sum + (order.redemption?.pointsCost ?? 0), 0);

  return { earnedThisYear, redeemed };
}
