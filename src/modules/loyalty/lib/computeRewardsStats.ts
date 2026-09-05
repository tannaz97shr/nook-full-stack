import type { Order } from "@/modules/order/types/order";

export interface RewardsStats {
  earnedThisYear: number;
  redeemed: number;
}

export function computeRewardsStats(orders: Order[]): RewardsStats {
  const currentYear = new Date().getFullYear();

  const earnedThisYear = orders
    .filter((order) => order.pointsAwardedAt !== null && new Date(order.pointsAwardedAt).getFullYear() === currentYear)
    .reduce((sum, order) => sum + (order.pointsEarned ?? 0), 0);

  const redeemed = orders
    // Only orders that actually reached Paid ever had points deducted (see markOrderPaidIfUnprocessed) — a Pending/Failed redemption intent never counts.
    .filter((order) => order.redemption !== null && order.paymentStatus === "Paid")
    .reduce((sum, order) => sum + (order.redemption?.pointsCost ?? 0), 0);

  return { earnedThisYear, redeemed };
}
