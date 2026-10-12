"use client";

// Home's client composition root for the featured row — same menu ↔ cart
// glue as MenuScreen, via the shared useMenuAddFlow hook.
import { useMenuAddFlow } from "@/modules/cart/hooks/useMenuAddFlow";
import { ItemCustomizationModal } from "@/modules/menu/components/ItemCustomizationModal";
import { MenuItemGrid } from "@/modules/menu/components/MenuItemGrid";
import type { MenuItem, Option, OptionGroup } from "@/modules/menu/types";

export interface FeaturedItemsGridProps {
  items: MenuItem[];
  optionGroupsById: Record<string, OptionGroup>;
  optionsById: Record<string, Option>;
}

export function FeaturedItemsGrid({ items, optionGroupsById, optionsById }: FeaturedItemsGridProps) {
  const { isAddReady, openItem, openItemGroups, handleAdd, handleAddFromModal, closeModal } = useMenuAddFlow({
    menuItemsById: Object.fromEntries(items.map((item) => [item.id, item])),
    optionGroupsById,
    optionsById,
  });

  return (
    <>
      <MenuItemGrid
        items={items}
        optionGroupsById={optionGroupsById}
        optionsById={optionsById}
        onAdd={handleAdd}
        addPending={!isAddReady}
      />
      {openItem && (
        <ItemCustomizationModal
          item={openItem}
          optionGroups={openItemGroups}
          optionsById={optionsById}
          open={Boolean(openItem)}
          onClose={closeModal}
          onAddToCart={handleAddFromModal}
          addPending={!isAddReady}
        />
      )}
    </>
  );
}
