import { roundToCents } from "@/shared/utils/format-money";
import type { MenuItem, Option } from "../types";
import type { SelectionsByGroupId } from "./optionGroupValidation";

/**
 * Pure item + selections -> price math, with no cart concept, so both the
 * customization modal's live total and cart/lib/pricing.ts's add-time
 * snapshot can share one implementation.
 */
export function computeSelectionTotal(
  item: MenuItem,
  optionsById: Record<string, Option>,
  selections: SelectionsByGroupId,
): number {
  const selectedIds = Object.values(selections).flat();
  const modifierTotal = selectedIds.reduce((sum, optionId) => {
    const option = optionsById[optionId];
    return option ? sum + option.priceModifier : sum;
  }, 0);
  return roundToCents(item.basePrice + modifierTotal);
}
