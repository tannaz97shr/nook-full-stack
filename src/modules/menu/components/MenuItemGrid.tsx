import type { MenuItem, Option, OptionGroup } from "../types";
import { MenuItemCard } from "./MenuItemCard";

export interface MenuItemGridProps {
  items: MenuItem[];
  optionGroupsById: Record<string, OptionGroup>;
  optionsById: Record<string, Option>;
  onAdd: (item: MenuItem) => void;
}

export function MenuItemGrid({ items, optionGroupsById, optionsById, onAdd }: MenuItemGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,272px),1fr))] gap-5">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          optionGroupsById={optionGroupsById}
          optionsById={optionsById}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}
