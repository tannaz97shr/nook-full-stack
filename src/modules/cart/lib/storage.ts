import { readLocalStorage, writeLocalStorage } from "@/shared/utils/safe-local-storage";
import type { CartState } from "../types";

const EMPTY_CART: CartState = { version: 1, items: [] };

export function readCart(key: string): CartState {
  const state = readLocalStorage<CartState>(key, EMPTY_CART);
  if (state.version !== 1 || !Array.isArray(state.items)) {
    return EMPTY_CART;
  }
  return state;
}

export function writeCart(key: string, state: CartState): void {
  writeLocalStorage(key, state);
}
