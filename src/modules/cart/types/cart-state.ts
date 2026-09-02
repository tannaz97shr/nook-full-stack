import type { CartLineItem } from "./cart-line-item";

export interface CartState {
  version: 1;
  items: CartLineItem[];
}
