import { formatMoney } from "@/shared/utils/format-money";

export const CART_HEADER_TITLE = "Your order";
export const CART_PICKUP_LOCATION = "Pickup at 41 Ashgrove Lane";

export function cartSummaryLine(count: number): string {
  if (count === 0) return CART_PICKUP_LOCATION;
  return `${count} item${count === 1 ? "" : "s"} · pickup in 10–15 min`;
}

export const CART_EMPTY_HEADING = "Nothing in here yet";
export const CART_EMPTY_COPY = "Add something from the menu to get started.";
export const CART_EMPTY_CTA = "Browse the menu";

export const TAX_RATE = 0.1;

export const REMOVE_LABEL = "Remove";
export const CHECKOUT_COMING_SOON_TITLE = "Checkout is coming soon";

export function checkoutButtonLabel(total: number): string {
  return `Checkout · ${formatMoney(total)}`;
}

export function itemRemovedMessage(name: string): string {
  return `${name} is no longer available and was removed from your cart.`;
}
