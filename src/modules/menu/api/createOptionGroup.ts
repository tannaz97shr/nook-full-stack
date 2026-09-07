import { adminDb } from "@/shared/lib/firebase-admin";
import { MENU_COLLECTIONS } from "../lib/collections";
import { DuplicateSlugError } from "../lib/errors";
import { slugify } from "../lib/slugify";
import type { OptionGroupInput } from "../lib/optionGroupSchema";
import type { OptionGroup } from "../types/option-group";

/**
 * Options are created as part of the group, not standalone — the design
 * mock and data model treat a group and its options as one authored unit.
 */
export async function createOptionGroup(input: OptionGroupInput): Promise<OptionGroup> {
  const groupId = slugify(input.name);

  return adminDb.runTransaction(async (tx) => {
    const groupRef = adminDb.collection(MENU_COLLECTIONS.optionGroups).doc(groupId);
    const existing = await tx.get(groupRef);
    if (existing.exists) {
      throw new DuplicateSlugError(MENU_COLLECTIONS.optionGroups, groupId);
    }

    const optionIds: string[] = [];
    for (const option of input.options) {
      const optionId = `${groupId}-${slugify(option.name)}`;
      optionIds.push(optionId);
      tx.set(adminDb.collection(MENU_COLLECTIONS.options).doc(optionId), {
        optionGroupId: groupId,
        name: option.name,
        priceModifier: option.priceModifier,
        isAvailable: option.isAvailable,
      });
    }

    const data = {
      name: input.name,
      selectionType: input.selectionType,
      isRequired: input.isRequired,
      minSelect: input.minSelect,
      maxSelect: input.maxSelect,
      optionIds,
    };
    tx.set(groupRef, data);

    return { id: groupId, ...data };
  });
}
