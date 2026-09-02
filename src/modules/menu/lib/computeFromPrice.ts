import { roundToCents } from "@/shared/utils/format-money";
import type { MenuItem, Option, OptionGroup } from "../types";

export interface FromPriceResult {
  /** True when the displayed price should carry a "From" prefix. */
  isFrom: boolean;
  price: number;
}

/**
 * Only required, single-select groups participate — required multi-select
 * groups are excluded, since "minimum cost" isn't well-defined for a group
 * where more than one option might be required (no seed data exercises
 * this, and it isn't resolvable without more product input).
 *
 * "From" triggers whenever ANY available option in a required-single group
 * is priced above zero, even if that group's cheapest option is itself
 * free — NOT only when the summed minimum (minDelta) is positive. On the
 * real seed menu, every required-single group's cheapest option is $0, so
 * a `minDelta > 0` gate would produce zero "From" labels across the whole
 * menu, which contradicts the spec's "From $X when required paid
 * modifiers exist" rule.
 */
export function computeFromPrice(
  item: MenuItem,
  optionGroupsById: Record<string, OptionGroup>,
  optionsById: Record<string, Option>,
): FromPriceResult {
  const requiredSingleGroups = item.optionGroupIds
    .map((id) => optionGroupsById[id])
    .filter(
      (group): group is OptionGroup =>
        Boolean(group) && group.isRequired && group.selectionType === "single",
    );

  let isFrom = false;
  let minDelta = 0;

  for (const group of requiredSingleGroups) {
    const availableOptions = group.optionIds
      .map((id) => optionsById[id])
      .filter((option): option is Option => Boolean(option) && option.isAvailable);

    if (availableOptions.length === 0) continue;

    if (availableOptions.some((option) => option.priceModifier > 0)) {
      isFrom = true;
    }

    minDelta += Math.min(...availableOptions.map((option) => option.priceModifier));
  }

  return { isFrom, price: roundToCents(item.basePrice + minDelta) };
}
