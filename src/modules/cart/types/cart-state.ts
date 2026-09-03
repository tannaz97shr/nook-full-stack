import type { CartLineItem } from "./cart-line-item";

export interface CartState {
  version: 2;
  items: CartLineItem[];
  selectedRewardId: string | null;
}
