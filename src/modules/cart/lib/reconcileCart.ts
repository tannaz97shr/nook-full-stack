import type { MenuItem, Option } from "@/modules/menu/types";
import type { CartLineItem } from "../types";

export interface ReconcileInput {
  cartItems: CartLineItem[];
  /** Fresh, from the /menu page's just-fetched data. */
  menuItemsById: Record<string, MenuItem>;
  optionsById: Record<string, Option>;
}

export interface ReconcileResult {
  keptItems: CartLineItem[];
  removed: { key: string; name: string }[];
}

/** Pure and idempotent — safe to re-run, which matters under React 18's dev-mode double-invoked effects. */
export function reconcileCart({
  cartItems,
  menuItemsById,
  optionsById,
}: ReconcileInput): ReconcileResult {
  const keptItems: CartLineItem[] = [];
  const removed: { key: string; name: string }[] = [];

  for (const line of cartItems) {
    const menuItem = menuItemsById[line.menuItemId];
    const isItemAvailable = Boolean(menuItem) && menuItem.isAvailable;
    const areOptionsAvailable = line.selections.every((group) =>
      group.options.every((option) => optionsById[option.optionId]?.isAvailable),
    );

    if (isItemAvailable && areOptionsAvailable) {
      keptItems.push(line);
    } else {
      removed.push({ key: line.key, name: line.name });
    }
  }

  return { keptItems, removed };
}
