import { adminDb } from "@/shared/lib/firebase-admin";
import { LOYALTY_COLLECTIONS } from "../lib/collections";
import { DuplicateSlugError } from "../lib/errors";
import { slugify } from "../lib/slugify";
import type { RewardInput } from "../lib/rewardSchema";
import type { RewardCatalogItem } from "../types/reward";

export async function createReward(input: RewardInput): Promise<RewardCatalogItem> {
  const id = slugify(input.name);

  return adminDb.runTransaction(async (tx) => {
    const ref = adminDb.collection(LOYALTY_COLLECTIONS.rewards).doc(id);
    const existing = await tx.get(ref);
    if (existing.exists) {
      throw new DuplicateSlugError(LOYALTY_COLLECTIONS.rewards, id);
    }

    const data = {
      name: input.name,
      description: input.description,
      pointsCost: input.pointsCost,
      discountValue: input.discountValue,
      isActive: input.isActive,
    };
    tx.set(ref, data);

    return { id, ...data };
  });
}
