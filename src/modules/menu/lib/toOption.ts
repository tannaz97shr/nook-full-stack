import type { DocumentSnapshot } from "firebase-admin/firestore";
import type { Option } from "../types/option";

/**
 * Doc ID is a composite natural slug, `${optionGroupId}-${optionSlug}`
 * (e.g. "size-large", "milk-oat"). Options are also a small, curated set
 * (not high-volume records like orders, which get auto-IDs), so a natural
 * slug is still preferable — but a plain slug risks collision across
 * groups (two groups could each want an option called "large"). Prefixing
 * with the parent group's ID keeps it collision-free and human-readable
 * without reaching for an auto-generated ID.
 */
export function toOption(doc: DocumentSnapshot): Option {
  const data = doc.data();
  if (!data) {
    throw new Error(`Option document ${doc.id} does not exist`);
  }

  return {
    id: doc.id,
    optionGroupId: data.optionGroupId,
    name: data.name,
    priceModifier: data.priceModifier,
    isAvailable: data.isAvailable,
  };
}
