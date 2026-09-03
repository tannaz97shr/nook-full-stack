export const REWARDS_HEADING = "Rewards";
export const REWARDS_HERO_LABEL = "Points balance";

export const REWARDS_STAT_LABELS = {
  earnedThisYear: "Earned this year",
  redeemed: "Redeemed",
  rate: "Rate",
} as const;
export const REWARDS_RATE_VALUE = "1 pt / $1";

export const REWARDS_CATALOG_HEADING = "Rewards you can redeem";
export const REWARDS_REDEEM_LABEL = "Redeem";
export const REWARDS_FOOTNOTE =
  "Points land the moment an order is marked complete. Orders placed as a guest can't be added to a balance afterwards — worth signing in first if you're close to a reward.";

export function rewardsNudge(pointsBalance: number, nextGoal: number | null): string {
  if (pointsBalance === 0 && nextGoal === null) {
    return "Order something and your points will start adding up here.";
  }
  if (nextGoal === null) {
    return "You have enough points to redeem any reward in the catalog.";
  }
  const remaining = nextGoal - pointsBalance;
  return `${remaining} more point${remaining === 1 ? "" : "s"} to your next reward.`;
}

export function rewardInsufficientPointsTitle(pointsCost: number, pointsBalance: number): string {
  return `Needs ${pointsCost} pts — you have ${pointsBalance}.`;
}
