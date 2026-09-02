import type { CartSelectedGroup } from "../types";

/** Deterministic across selection order, so identical configurations merge quantity instead of duplicating. */
export function cartLineKey(menuItemId: string, selections: CartSelectedGroup[]): string {
  const groupsPart = [...selections]
    .map((group) => ({
      optionGroupId: group.optionGroupId,
      optionIds: [...group.options.map((option) => option.optionId)].sort(),
    }))
    .sort((a, b) => a.optionGroupId.localeCompare(b.optionGroupId))
    .map((group) => `${group.optionGroupId}:${group.optionIds.join(",")}`)
    .join("|");

  return `${menuItemId}::${groupsPart}`;
}
