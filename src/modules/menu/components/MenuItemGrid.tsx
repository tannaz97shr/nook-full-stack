import type { MenuItem, Option, OptionGroup } from "../types";
import { MenuItemCard } from "./MenuItemCard";

export interface MenuItemGridProps {
  items: MenuItem[];
  optionGroupsById: Record<string, OptionGroup>;
  optionsById: Record<string, Option>;
  onAdd: (item: MenuItem) => void;
  /** Preload the first card's photo — for grids that sit above the fold, where it's the LCP. */
  prioritizeFirst?: boolean;
}

export function MenuItemGrid({
  items,
  optionGroupsById,
  optionsById,
  onAdd,
  prioritizeFirst = false,
}: MenuItemGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,272px),1fr))] gap-5">
      {items.map((item, index) => (
        <MenuItemCard
          key={item.id}
          item={item}
          optionGroupsById={optionGroupsById}
          optionsById={optionsById}
          onAdd={onAdd}
          priority={prioritizeFirst && index === 0}
        />
      ))}
    </div>
  );
}
