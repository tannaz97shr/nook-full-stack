import type { DocumentSnapshot } from "firebase-admin/firestore";
import type { RewardCatalogItem } from "../types/reward";

export function toReward(doc: DocumentSnapshot): RewardCatalogItem {
  const data = doc.data();
  if (!data) {
    throw new Error(`Reward document ${doc.id} does not exist`);
  }

  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    pointsCost: data.pointsCost,
    discountValue: data.discountValue,
    isActive: data.isActive,
  };
}
