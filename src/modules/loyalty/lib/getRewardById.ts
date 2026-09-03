import { REWARDS_CATALOG } from "../content/rewardsCatalog";
import type { RewardCatalogItem } from "../types/reward";

export function getRewardById(id: string): RewardCatalogItem | null {
  return REWARDS_CATALOG.find((reward) => reward.id === id) ?? null;
}
