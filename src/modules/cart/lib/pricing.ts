import type { SelectionsByGroupId } from "@/modules/menu/lib/optionGroupValidation";
import type { Option, OptionGroup } from "@/modules/menu/types";
import type { CartSelectedGroup } from "../types";

/**
 * Converts menu's selections shape (group id -> selected option ids) into
 * cart's denormalized snapshot shape, using the same fresh maps the
 * customization modal used to compute the authoritative unit price — so a
 * cart line's option names/deltas always match what was shown at add-time.
 */
export function buildSelectedGroups(
  selections: SelectionsByGroupId,
  optionGroupsById: Record<string, OptionGroup>,
  optionsById: Record<string, Option>,
): CartSelectedGroup[] {
  return Object.entries(selections)
    .filter(([, optionIds]) => optionIds.length > 0)
    .map(([groupId, optionIds]) => {
      const group = optionGroupsById[groupId];
      return {
        optionGroupId: groupId,
        optionGroupName: group?.name ?? groupId,
        options: optionIds
          .map((optionId) => optionsById[optionId])
          .filter((option): option is Option => Boolean(option))
          .map((option) => ({
            optionId: option.id,
            name: option.name,
            priceModifier: option.priceModifier,
          })),
      };
    });
}
