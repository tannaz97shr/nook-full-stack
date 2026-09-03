import { readLocalStorage, writeLocalStorage } from "@/shared/utils/safe-local-storage";
import type { CartState } from "../types";

const EMPTY_CART: CartState = { version: 2, items: [], selectedRewardId: null };

/** v1 predates loyalty (Phase 5b) — migrated rather than discarded so a real in-flight cart isn't wiped by this deploy. */
interface CartStateV1 {
  version: 1;
  items: CartState["items"];
}

export function readCart(key: string): CartState {
  const state = readLocalStorage<CartState | CartStateV1>(key, EMPTY_CART);
  if (!state || !Array.isArray(state.items)) {
    return EMPTY_CART;
  }
  if (state.version === 2) {
    return state;
  }
  if (state.version === 1) {
    return { version: 2, items: state.items, selectedRewardId: null };
  }
  return EMPTY_CART;
}

export function writeCart(key: string, state: CartState): void {
  writeLocalStorage(key, state);
}
