import type { CartState } from "../types";

export interface MergeGuestCartResult {
  merged: CartState;
  /** Total quantity brought over from the guest cart — 0 means nothing changed. */
  movedCount: number;
}

/**
 * Folds a guest cart into the signed-in account's cart. Lines with the same
 * cartLineKey (same item + same selections) sum their quantities, keeping the
 * account line's snapshot; other guest lines are appended. The account's
 * selectedRewardId wins — rewards belong to the account, not the device.
 * Pure: the caller owns reading/writing storage and deleting the guest cart.
 */
export function mergeGuestCart(account: CartState, guest: CartState): MergeGuestCartResult {
  const items = [...account.items];
  for (const line of guest.items) {
    const index = items.findIndex((existing) => existing.key === line.key);
    if (index === -1) {
      items.push(line);
    } else {
      items[index] = { ...items[index], quantity: items[index].quantity + line.quantity };
    }
  }

  return {
    merged: { version: 2, items, selectedRewardId: account.selectedRewardId },
    movedCount: guest.items.reduce((sum, line) => sum + line.quantity, 0),
  };
}
