"use client";

import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { roundToCents } from "@/shared/utils/format-money";
import type { MenuItem, Option } from "@/modules/menu/types";
import { TAX_RATE } from "../content/cartContent";
import { cartStorageKey } from "../lib/cartId";
import { cartLineKey } from "../lib/cartLineKey";
import { reconcileCart } from "../lib/reconcileCart";
import { readCart, writeCart } from "../lib/storage";
import type { CartLineItem, CartSelectedGroup, CartState } from "../types";

export interface CartContextValue {
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
  /** Empties the cart — only called once an order is confirmed Paid (see order module's confirmation screen). */
  clear: () => void;
  subtotal: number;
  tax: number;
  total: number;
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

  useEffect(() => {
    const state = readCart(cartStorageKey(userId));
    setItems(state.items);
    setHydratedForUserId(userId);
  }, [userId]);

  useEffect(() => {
    if (hydratedForUserId !== userId) return;
    const state: CartState = { version: 1, items };
    writeCart(cartStorageKey(userId), state);
  }, [items, hydratedForUserId, userId]);

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
  const tax = roundToCents(subtotal * TAX_RATE);
  const total = roundToCents(subtotal + tax);
  const count = items.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <CartContext.Provider
      value={{
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
        subtotal,
        tax,
        total,
        count,
        isEmpty: items.length === 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
