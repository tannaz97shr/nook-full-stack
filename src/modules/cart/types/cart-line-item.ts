export interface CartSelectedOption {
  optionId: string;
  name: string;
  priceModifier: number;
}

export interface CartSelectedGroup {
  optionGroupId: string;
  optionGroupName: string;
  options: CartSelectedOption[];
}

export interface CartLineItem {
  /** cartLineKey(menuItemId, selections) — identical configurations merge quantity instead of duplicating. */
  key: string;
  menuItemId: string;
  /** Snapshots below are denormalized so the drawer renders fully from localStorage alone, even right after a reload before /menu re-fetches anything. Never trusted at checkout time — Phase 4b re-verifies server-side. */
  name: string;
  image: string | null;
  selections: CartSelectedGroup[];
  quantity: number;
  /** basePrice + selected priceModifiers, computed once at add-time. */
  unitPrice: number;
  addedAt: number;
}
