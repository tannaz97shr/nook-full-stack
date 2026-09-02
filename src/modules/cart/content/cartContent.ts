import { formatMoney } from "@/shared/utils/format-money";
import { TAX_RATE } from "@/modules/order/lib/pricingConstants";

export { TAX_RATE };

export const CART_HEADER_TITLE = "Your order";
export const CART_PICKUP_LOCATION = "Pickup at 41 Ashgrove Lane";

export function cartSummaryLine(count: number): string {
  if (count === 0) return CART_PICKUP_LOCATION;
  return `${count} item${count === 1 ? "" : "s"} · pickup in 10–15 min`;
}

export const CART_EMPTY_HEADING = "Nothing in here yet";
export const CART_EMPTY_COPY = "Add something from the menu to get started.";
export const CART_EMPTY_CTA = "Browse the menu";

export const REMOVE_LABEL = "Remove";
export const CHECKOUT_ERROR_MESSAGE = "Something went wrong starting checkout. Please try again.";

export function checkoutButtonLabel(total: number, isSubmitting: boolean): string {
  if (isSubmitting) return "Redirecting to checkout…";
  return `Checkout · ${formatMoney(total)}`;
}

export function itemRemovedMessage(name: string): string {
  return `${name} is no longer available and was removed from your cart.`;
}
