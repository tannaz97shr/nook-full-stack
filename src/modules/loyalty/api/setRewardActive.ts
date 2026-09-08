import { adminDb } from "@/shared/lib/firebase-admin";
import { LOYALTY_COLLECTIONS } from "../lib/collections";
import { RewardNotFoundError } from "../lib/errors";

/** The active-toggle's backend — a focused single-field write, not a full reward update. */
export async function setRewardActive(id: string, isActive: boolean): Promise<void> {
  const ref = adminDb.collection(LOYALTY_COLLECTIONS.rewards).doc(id);
  const existing = await ref.get();
  if (!existing.exists) {
    throw new RewardNotFoundError(id);
  }
  await ref.update({ isActive });
}
