import { formatMoney } from "@/shared/utils/format-money";
import type { DietaryTag } from "../types";

export const DIETARY_BADGE_LABELS: Record<DietaryTag, { abbrev: string; full: string }> = {
  vegan: { abbrev: "VE", full: "Vegan" },
  "gluten-free": { abbrev: "GF", full: "Gluten free" },
  "dairy-free": { abbrev: "DF", full: "Dairy free" },
  "contains-nuts": { abbrev: "NUT", full: "Contains nuts" },
};

export const DIETARY_LEGEND =
  "VE Vegan · GF Gluten free · DF Dairy free · NUT Contains nuts. Prepared in a kitchen that also handles nuts.";

export const SOLD_OUT_LABEL = "Sold out";
export const UNAVAILABLE_ADD_LABEL = "Unavailable";
export const CHOOSE_ADD_LABEL = "Choose";
export const QUICK_ADD_LABEL = "+ Add";
export const FROM_PRICE_PREFIX = "From";

export const MODAL_SELECTION_HINTS: Record<"single" | "multiple", string> = {
  single: "Choose one",
  multiple: "Choose as many as you like",
};

export const REQUIRED_TAG_LABEL = "Required";
export const OPTIONAL_TAG_LABEL = "Optional";

export function addToCartButtonLabel(total: number, isValid: boolean): string {
  return isValid ? `Add to cart · ${formatMoney(total)}` : "Add to cart";
}

export function missingSelectionMessage(unsatisfiedGroupNames: string[]): string {
  return `Choose a ${unsatisfiedGroupNames.join(" and a ").toLowerCase()} to continue`;
}

export function instantAddToastMessage(itemName: string): string {
  return `+1 ${itemName}`;
}
