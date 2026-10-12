"use client";

import { useState } from "react";
import { instantAddToastMessage } from "@/modules/menu/content/menuContent";
import type { SelectionsByGroupId } from "@/modules/menu/lib/optionGroupValidation";
import type { MenuItem, Option, OptionGroup } from "@/modules/menu/types";
import { useHasMounted } from "@/shared/hooks/useHasMounted";
import { useToast } from "@/shared/hooks/useToast";
import { buildSelectedGroups } from "../lib/pricing";
import { useCart } from "./useCart";

interface UseMenuAddFlowInput {
  menuItemsById: Record<string, MenuItem>;
  optionGroupsById: Record<string, OptionGroup>;
  optionsById: Record<string, Option>;
}

/**
 * The menu → cart glue shared by every surface that renders MenuItemCards
 * (/menu and the homepage featured row). Items with no option groups add
 * instantly with a toast; anything else opens ItemCustomizationModal, which
 * the caller renders from `openItem` / `openItemGroups`. Lives in cart, not
 * menu, so the dependency stays one-way (cart → menu).
 */
export function useMenuAddFlow({ menuItemsById, optionGroupsById, optionsById }: UseMenuAddFlowInput) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const cart = useCart();
  const { showToast } = useToast();
  // Add buttons are server-rendered, so they're visible before React has
  // attached their click handlers — a click in that gap silently does
  // nothing. Keep them disabled until this component has mounted (handlers
  // live) and the cart has hydrated. useHasMounted, not cart.isHydrated
  // alone: on /menu the grid streams in behind loading.tsx and hydrates
  // after CartProvider, so isHydrated is already true there while the
  // server HTML says disabled — a mismatch React 18 never patches.
  const hasMounted = useHasMounted();
  const isAddReady = hasMounted && cart.isHydrated;

  function handleAdd(item: MenuItem) {
    if (item.optionGroupIds.length === 0) {
      cart.addSimpleItem(item);
      showToast(instantAddToastMessage(item.name));
      return;
    }
    setOpenItemId(item.id);
  }

  function handleAddFromModal(
    item: MenuItem,
    selections: SelectionsByGroupId,
    quantity: number,
    unitPrice: number,
  ) {
    const selectedGroups = buildSelectedGroups(selections, optionGroupsById, optionsById);
    cart.addItem(item, selectedGroups, quantity, unitPrice);
  }

  const openItem = openItemId ? (menuItemsById[openItemId] ?? null) : null;
  const openItemGroups = openItem
    ? openItem.optionGroupIds
        .map((id) => optionGroupsById[id])
        .filter((group): group is OptionGroup => Boolean(group))
    : [];

  return {
    isAddReady,
    openItem,
    openItemGroups,
    handleAdd,
    handleAddFromModal,
    closeModal: () => setOpenItemId(null),
  };
}
