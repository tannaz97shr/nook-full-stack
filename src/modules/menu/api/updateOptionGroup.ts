import { adminDb } from "@/shared/lib/firebase-admin";
import { MENU_COLLECTIONS } from "../lib/collections";
import { MenuEntityNotFoundError } from "../lib/errors";
import { slugify } from "../lib/slugify";
import type { OptionGroupInput } from "../lib/optionGroupSchema";
import type { OptionGroup } from "../types/option-group";

/**
 * Diffs the submitted options list against the group's current optionIds:
 * a submitted option with no `id` is a new Option doc; an existing
 * optionId missing from the submission is tx.delete()d. Safe to
 * hard-delete — OrderLineItem snapshots option data at order-creation
 * time (src/modules/order/types/order.ts) and never holds a live FK to
 * an Option doc, so a past order can never dangle.
 */
export async function updateOptionGroup(id: string, input: OptionGroupInput): Promise<OptionGroup> {
  const groupRef = adminDb.collection(MENU_COLLECTIONS.optionGroups).doc(id);

  return adminDb.runTransaction(async (tx) => {
    const existing = await tx.get(groupRef);
    if (!existing.exists) {
      throw new MenuEntityNotFoundError("OptionGroup", id);
    }

    const existingOptionIds = new Set<string>(existing.data()!.optionIds);
    const submittedIds = new Set(
      input.options.filter((option) => option.id).map((option) => option.id as string),
    );

    const optionIds: string[] = [];
    for (const option of input.options) {
      const optionId = option.id ?? `${id}-${slugify(option.name)}`;
      optionIds.push(optionId);
      tx.set(adminDb.collection(MENU_COLLECTIONS.options).doc(optionId), {
        optionGroupId: id,
        name: option.name,
        priceModifier: option.priceModifier,
        isAvailable: option.isAvailable,
      });
    }

    for (const existingId of Array.from(existingOptionIds)) {
      if (!submittedIds.has(existingId)) {
        tx.delete(adminDb.collection(MENU_COLLECTIONS.options).doc(existingId));
      }
    }

    const data = {
      name: input.name,
      selectionType: input.selectionType,
      isRequired: input.isRequired,
      minSelect: input.minSelect,
      maxSelect: input.maxSelect,
      optionIds,
    };
    tx.update(groupRef, data);

    return { id, ...data };
  });
}
