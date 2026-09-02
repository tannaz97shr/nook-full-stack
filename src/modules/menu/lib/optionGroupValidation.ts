import type { OptionGroup } from "../types";

/** Selected option ids, keyed by their OptionGroup.id. */
export type SelectionsByGroupId = Record<string, string[]>;

export function isGroupSatisfied(group: OptionGroup, selectedIds: string[]): boolean {
  if (group.selectionType === "single") {
    return selectedIds.length === 1;
  }
  return selectedIds.length >= group.minSelect && selectedIds.length <= group.maxSelect;
}

export function isModalValid(groups: OptionGroup[], selections: SelectionsByGroupId): boolean {
  return groups
    .filter((group) => group.isRequired)
    .every((group) => isGroupSatisfied(group, selections[group.id] ?? []));
}

export function unsatisfiedGroupNames(
  groups: OptionGroup[],
  selections: SelectionsByGroupId,
): string[] {
  return groups
    .filter((group) => group.isRequired && !isGroupSatisfied(group, selections[group.id] ?? []))
    .map((group) => group.name);
}
