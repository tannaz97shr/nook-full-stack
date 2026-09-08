import { adminDb } from "@/shared/lib/firebase-admin";
import { LOYALTY_COLLECTIONS } from "../lib/collections";
import { RewardNotFoundError } from "../lib/errors";
import type { RewardInput } from "../lib/rewardSchema";
import type { RewardCatalogItem } from "../types/reward";

/** Never touches `id` — the full edit form can also flip isActive, separately from the quick toggle. */
export async function updateReward(id: string, input: RewardInput): Promise<RewardCatalogItem> {
  const ref = adminDb.collection(LOYALTY_COLLECTIONS.rewards).doc(id);
  const existing = await ref.get();
  if (!existing.exists) {
    throw new RewardNotFoundError(id);
  }

  const data = {
    name: input.name,
    description: input.description,
    pointsCost: input.pointsCost,
    discountValue: input.discountValue,
    isActive: input.isActive,
  };
  await ref.update(data);

  return { id, ...data };
}
