"use client";

import { useState } from "react";
import { computeSelectionTotal } from "../lib/computeSelectionTotal";
import { isModalValid, unsatisfiedGroupNames } from "../lib/optionGroupValidation";
import type { SelectionsByGroupId } from "../lib/optionGroupValidation";
import type { MenuItem, Option, OptionGroup } from "../types";

interface UseItemCustomizationInput {
  item: MenuItem;
  optionGroups: OptionGroup[];
  optionsById: Record<string, Option>;
}

export function useItemCustomization({
  item,
  optionGroups,
  optionsById,
}: UseItemCustomizationInput) {
  const [selections, setSelections] = useState<SelectionsByGroupId>({});
  const [quantity, setQuantity] = useState(1);

  function toggleOption(group: OptionGroup, optionId: string) {
    setSelections((current) => {
      const selected = current[group.id] ?? [];

      if (group.selectionType === "single") {
        return { ...current, [group.id]: [optionId] };
      }

      if (selected.includes(optionId)) {
        return { ...current, [group.id]: selected.filter((id) => id !== optionId) };
      }
      if (selected.length >= group.maxSelect) {
        return current;
      }
      return { ...current, [group.id]: [...selected, optionId] };
    });
  }

  function reset() {
    setSelections({});
    setQuantity(1);
  }

  const isValid = isModalValid(optionGroups, selections);
  const unsatisfiedNames = unsatisfiedGroupNames(optionGroups, selections);
  const unitTotal = computeSelectionTotal(item, optionsById, selections);
  const total = unitTotal * quantity;

  return {
    selections,
    quantity,
    toggleOption,
    incrementQuantity: () => setQuantity((q) => q + 1),
    decrementQuantity: () => setQuantity((q) => Math.max(1, q - 1)),
    isValid,
    unsatisfiedNames,
    unitTotal,
    total,
    reset,
  };
}
