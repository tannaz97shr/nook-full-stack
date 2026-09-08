import { adminDb } from "@/shared/lib/firebase-admin";
import { LOYALTY_COLLECTIONS } from "./collections";
import { toReward } from "./toReward";
import type { RewardCatalogItem } from "../types/reward";

/** Server-only. A single Reward by ID (any status), or null if it doesn't exist. */
export async function getRewardById(id: string): Promise<RewardCatalogItem | null> {
  const doc = await adminDb.collection(LOYALTY_COLLECTIONS.rewards).doc(id).get();
  return doc.exists ? toReward(doc) : null;
}
