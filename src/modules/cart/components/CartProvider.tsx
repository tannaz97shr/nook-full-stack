"use client";

import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useToast } from "@/shared/hooks/useToast";
import { roundToCents } from "@/shared/utils/format-money";
import type { MenuItem, Option } from "@/modules/menu/types";
import { guestCartMergedMessage } from "../content/cartContent";
import { cartStorageKey, existingGuestCartStorageKey } from "../lib/cartId";
import { cartLineKey } from "../lib/cartLineKey";
import { mergeGuestCart } from "../lib/mergeGuestCart";
import { reconcileCart } from "../lib/reconcileCart";
import { readCart, removeCart, writeCart } from "../lib/storage";
import type { CartLineItem, CartSelectedGroup, CartState } from "../types";

export interface CartContextValue {
  userId: string | null;
  items: CartLineItem[];
  /**
   * True once `items` reflects this userId's actual stored cart (or the
   * fact that none exists yet) — false during the SSR-safe [] render and
   * until the hydration effect below has run. Consumers that need to act
   * on real cart contents on mount (e.g. reconciliation) MUST gate on
   * this instead of firing unconditionally: since CartProvider sits above
   * them in the tree, their own mount effects fire BEFORE CartProvider's
   * hydration effect (React runs child effects before parent effects),
   * so an unconditional on-mount effect would always see the pre-
   * hydration empty cart on a fresh/direct page load.
   */
  isHydrated: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (
    item: MenuItem,
    selectedGroups: CartSelectedGroup[],
    quantity: number,
    unitPrice: number,
  ) => void;
  addSimpleItem: (item: MenuItem) => void;
  incrementQty: (key: string) => void;
  decrementQty: (key: string) => void;
  removeItem: (key: string) => void;
  reconcile: (
    menuItemsById: Record<string, MenuItem>,
    optionsById: Record<string, Option>,
  ) => { removedNames: string[] };
  /** Empties the cart — only called once an order is confirmed Paid (see order module's confirmation screen). Also clears any selected reward. */
  clear: () => void;
  selectedRewardId: string | null;
  selectReward: (rewardId: string) => void;
  clearReward: () => void;
  /** Sum of GST-inclusive line prices — the pre-reward total. Discount/GST figures come from order/lib/gst.ts's computeOrderTotals, the same function /api/checkout uses. */
  subtotal: number;
  count: number;
  isEmpty: boolean;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  userId,
  children,
}: {
  userId: string | null;
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  // Which userId's data `items` currently reflects — undefined until the
  // hydration effect below has run at least once. This MUST be React
  // state, not a ref: a ref mutates synchronously, so the persist effect
  // (declared after the hydration effect, same commit) would see the
  // ref already flipped to "hydrated" while still closing over that same
  // render's stale pre-hydration `items` ([]) — the setItems call from
  // hydration hasn't flowed into a render yet. That combination writes
  // the empty pre-hydration state to localStorage, clobbering whatever
  // was actually stored (100% reproducible under Strict Mode's double
  // effect invocation, since neither of the two invocations gets a fresh
  // render in between). State doesn't have that problem: the persist
  // effect that ran in a given render only ever sees THAT render's own
  // `items`, so gating on "does hydratedForUserId (this render's value)
  // match userId" and only writing once both are consistent means a
  // write can only happen in a render where `items` has actually caught
  // up with hydration.
  const [hydratedForUserId, setHydratedForUserId] = useState<string | null | undefined>(
    undefined,
  );

  const { showToast } = useToast();

  useEffect(() => {
    const key = cartStorageKey(userId);
    let state = readCart(key);

    // Signed in with items still in this device's guest cart — either from
    // before sign-in, or added afterwards in a tab still on the guest page.
    // Merged and the guest cart deleted right here, synchronously, rather
    // than via the persist effect: that makes it idempotent under Strict
    // Mode's double invoke (the second run finds no guest cart and does
    // nothing), and rescues stale-tab items on any later load, not just the
    // first one after signing in.
    const guestKey = userId ? existingGuestCartStorageKey() : null;
    const guest = guestKey ? readCart(guestKey) : null;
    if (guestKey && guest && guest.items.length > 0) {
      const { merged, movedCount } = mergeGuestCart(state, guest);
      writeCart(key, merged);
      removeCart(guestKey);
      state = merged;
      showToast(guestCartMergedMessage(movedCount));
    }

    setItems(state.items);
    setSelectedRewardId(state.selectedRewardId);
    setHydratedForUserId(userId);
  }, [userId, showToast]);

  // Another tab changed this cart: adopt its state instead of letting this
  // tab's stale in-memory copy overwrite it on the next change. Only this
  // tab's own key (or a full clear(), which reports key === null). The
  // write that follows the re-render is skipped by writeCart since the
  // stored value already matches, and the persist effect's
  // hydratedForUserId gate still applies.
  useEffect(() => {
    const key = cartStorageKey(userId);
    function handleStorage(event: StorageEvent) {
      if (event.storageArea !== localStorage) return;
      if (event.key !== null && event.key !== key) return;
      const state = readCart(key);
      setItems(state.items);
      setSelectedRewardId(state.selectedRewardId);
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [userId]);

  useEffect(() => {
    if (hydratedForUserId !== userId) return;
    const state: CartState = { version: 2, items, selectedRewardId };
    writeCart(cartStorageKey(userId), state);
  }, [items, selectedRewardId, hydratedForUserId, userId]);

  function addItem(
    item: MenuItem,
    selectedGroups: CartSelectedGroup[],
    quantity: number,
    unitPrice: number,
  ) {
    const key = cartLineKey(item.id, selectedGroups);
    setItems((current) => {
      const existing = current.find((line) => line.key === key);
      if (existing) {
        return current.map((line) =>
          line.key === key ? { ...line, quantity: line.quantity + quantity } : line,
        );
      }
      const newLine: CartLineItem = {
        key,
        menuItemId: item.id,
        name: item.name,
        image: item.images[0] ?? null,
        selections: selectedGroups,
        quantity,
        unitPrice,
        addedAt: Date.now(),
      };
      return [...current, newLine];
    });
  }

  function addSimpleItem(item: MenuItem) {
    addItem(item, [], 1, item.basePrice);
  }

  function incrementQty(key: string) {
    setItems((current) =>
      current.map((line) => (line.key === key ? { ...line, quantity: line.quantity + 1 } : line)),
    );
  }

  function decrementQty(key: string) {
    setItems((current) =>
      current
        .map((line) => (line.key === key ? { ...line, quantity: line.quantity - 1 } : line))
        .filter((line) => line.quantity > 0),
    );
  }

  function removeItem(key: string) {
    setItems((current) => current.filter((line) => line.key !== key));
  }

  function clear() {
    setItems([]);
    setSelectedRewardId(null);
  }

  function selectReward(rewardId: string) {
    setSelectedRewardId(rewardId);
  }

  function clearReward() {
    setSelectedRewardId(null);
  }

  function reconcile(
    menuItemsById: Record<string, MenuItem>,
    optionsById: Record<string, Option>,
  ) {
    const { keptItems, removed } = reconcileCart({ cartItems: items, menuItemsById, optionsById });
    if (removed.length > 0) {
      setItems(keptItems);
    }
    return { removedNames: removed.map((entry) => entry.name) };
  }

  const subtotal = roundToCents(items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0));
  const count = items.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        userId,
        items,
        isHydrated: hydratedForUserId === userId,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        addItem,
        addSimpleItem,
        incrementQty,
        decrementQty,
        removeItem,
        reconcile,
        clear,
        selectedRewardId,
        selectReward,
        clearReward,
        subtotal,
        count,
        isEmpty: items.length === 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
