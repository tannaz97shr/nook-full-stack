"use client";

// This is the one deliberate exception to "menu must never import from
// cart": as the /menu page's client composition root, MenuScreen is what
// actually glues the two features together (cart add + the reconciliation
// side effect), the same role Header.tsx plays for CartTrigger. Menu's
// own domain logic — lib/, hooks/, content/ — stays cart-agnostic.
import { useEffect, useRef, useState } from "react";
import { itemRemovedMessage } from "@/modules/cart/content/cartContent";
import { useCart } from "@/modules/cart/hooks/useCart";
import { useMenuAddFlow } from "@/modules/cart/hooks/useMenuAddFlow";
import { useToast } from "@/shared/hooks/useToast";
import { DIETARY_LEGEND } from "../content/menuContent";
import type { MenuItem, Option, OptionGroup } from "../types";
import { CategoryTabs } from "./CategoryTabs";
import type { CategoryTabItem } from "./CategoryTabs";
import { ItemCustomizationModal } from "./ItemCustomizationModal";
import { MenuItemGrid } from "./MenuItemGrid";

export interface MenuScreenProps {
  categories: CategoryTabItem[];
  itemsByCategoryId: Record<string, MenuItem[]>;
  menuItemsById: Record<string, MenuItem>;
  optionGroupsById: Record<string, OptionGroup>;
  optionsById: Record<string, Option>;
}

export function MenuScreen({
  categories,
  itemsByCategoryId,
  menuItemsById,
  optionGroupsById,
  optionsById,
}: MenuScreenProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? "");
  const cart = useCart();
  const { showToast } = useToast();
  const { openItem, openItemGroups, handleAdd, handleAddFromModal, closeModal } = useMenuAddFlow({
    menuItemsById,
    optionGroupsById,
    optionsById,
  });

  // Opportunistic detection only — /menu always has fresh availability
  // data from its Server Component fetch, so this is where the spec's
  // "item goes unavailable while in cart" edge case gets caught, not a
  // live subscription. Gated on cart.isHydrated rather than firing
  // unconditionally on mount: relying on an unconditional effect would
  // mean this correctly reconciles only for as long as CartProvider's own
  // hydration effect happens to fire first in the commit (true today,
  // verified empirically — CartProvider is a shallower ancestor and its
  // effect runs before this one — but that's an artifact of the current
  // tree shape, not a documented React guarantee, and it silently breaks
  // the moment that ordering changes). Gating on isHydrated makes this
  // correct independent of effect-firing order. It also fixes a real,
  // separately-confirmed bug: without the ref guard, React 18 Strict
  // Mode's dev-only double-invoke fires this effect twice on mount,
  // producing two duplicate toasts for the same removed item.
  const hasReconciledRef = useRef(false);
  useEffect(() => {
    if (!cart.isHydrated || hasReconciledRef.current) return;
    hasReconciledRef.current = true;
    const { removedNames } = cart.reconcile(menuItemsById, optionsById);
    for (const name of removedNames) {
      showToast(itemRemovedMessage(name), "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.isHydrated]);

  if (categories.length === 0) {
    return (
      <main className="mx-auto max-w-[1240px] px-4 py-12 text-center sm:px-8">
        <p className="text-ink-subtle">Nothing on the menu right now — check back soon.</p>
      </main>
    );
  }

  const activeItems = itemsByCategoryId[activeCategoryId] ?? [];

  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-16 sm:px-8">
      <h1 className="py-8 font-display text-4xl text-ink">Menu</h1>
      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelect={setActiveCategoryId}
      />
      <div className="py-6">
        <MenuItemGrid
          items={activeItems}
          optionGroupsById={optionGroupsById}
          optionsById={optionsById}
          onAdd={handleAdd}
          prioritizeFirst
        />
      </div>
      <p className="border-t border-border pt-6 text-xs text-ink-subtle">{DIETARY_LEGEND}</p>

      {openItem && (
        <ItemCustomizationModal
          item={openItem}
          optionGroups={openItemGroups}
          optionsById={optionsById}
          open={Boolean(openItem)}
          onClose={closeModal}
          onAddToCart={handleAddFromModal}
        />
      )}
    </main>
  );
}
