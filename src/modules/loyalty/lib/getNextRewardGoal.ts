import type { RewardCatalogItem } from "../types/reward";

/** The cheapest catalog reward the user can't yet afford, for the rewards-page progress bar; null once every reward is already affordable. */
export function getNextRewardGoal(pointsBalance: number, catalog: RewardCatalogItem[]): number | null {
  const next = catalog
    .filter((reward) => reward.pointsCost > pointsBalance)
    .sort((a, b) => a.pointsCost - b.pointsCost)[0];
  return next?.pointsCost ?? null;
}
