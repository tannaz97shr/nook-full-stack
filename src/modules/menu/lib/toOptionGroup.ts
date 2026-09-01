import type { DocumentSnapshot } from "firebase-admin/firestore";
import type { OptionGroup } from "../types/option-group";

/**
 * Doc ID is a natural slug (e.g. "size", "milk", "addons"), same treatment
 * as Category/MenuItem: OptionGroups are a small, curated, admin-managed
 * set reused by name across many MenuItems, so a readable content-derived
 * ID beats a random auto-ID — easy to find in the console and safe to
 * reference by literal string in seed/admin code.
 */
export function toOptionGroup(doc: DocumentSnapshot): OptionGroup {
  const data = doc.data();
  if (!data) {
    throw new Error(`OptionGroup document ${doc.id} does not exist`);
  }

  return {
    id: doc.id,
    name: data.name,
    selectionType: data.selectionType,
    isRequired: data.isRequired,
    minSelect: data.minSelect,
    maxSelect: data.maxSelect,
    optionIds: data.optionIds,
  };
}
