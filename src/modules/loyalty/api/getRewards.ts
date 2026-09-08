import { adminDb } from "@/shared/lib/firebase-admin";
import { LOYALTY_COLLECTIONS } from "../lib/collections";
import { toReward } from "../lib/toReward";
import type { RewardCatalogItem } from "../types/reward";

/** Public catalog reads — only active rewards, ordered cheapest first. */
export async function getActiveRewards(): Promise<RewardCatalogItem[]> {
  const snapshot = await adminDb
    .collection(LOYALTY_COLLECTIONS.rewards)
    .where("isActive", "==", true)
    .orderBy("pointsCost")
    .get();

  return snapshot.docs.map(toReward);
}

/** Server-only, admin use. Every Reward regardless of active status. */
export async function getAllRewards(): Promise<RewardCatalogItem[]> {
  const snapshot = await adminDb.collection(LOYALTY_COLLECTIONS.rewards).orderBy("pointsCost").get();
  return snapshot.docs.map(toReward);
}
