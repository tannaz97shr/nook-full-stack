import { STRIPE_TEST_CARD } from "@/shared/content/demo-content";
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

export const REMOVE_LABEL = "Remove";

// Accessible names for a cart row's controls — the visible text stays generic ("Remove", "−", "+"), but a screen reader
// user tabbing through several rows needs to know which item each button acts on. Remove's name starts with its visible
// text so voice-control users can still say "click Remove". The selected options are part of the name because two rows
// can hold the same item ("Remove Flat White, Large, Oat" vs "Remove Flat White, Small").
export function cartLineAccessibleName(name: string, optionNames: string[]): string {
  return [name, ...optionNames].join(", ");
}

export function removeItemLabel(name: string): string {
  return `${REMOVE_LABEL} ${name}`;
}

export function increaseQuantityLabel(name: string): string {
  return `Increase quantity of ${name}`;
}

export function decreaseQuantityLabel(name: string): string {
  return `Decrease quantity of ${name}`;
}
/** Portfolio deployment: Stripe runs in test mode, so every visitor needs the test card. */
export const CART_DEMO_NOTICE = `Demo store. Payments use Stripe test mode, so nothing is charged. Pay with card ${STRIPE_TEST_CARD}, any future date and any CVC.`;

export const CHECKOUT_ERROR_MESSAGE = "Something went wrong starting checkout. Please try again.";

export function checkoutButtonLabel(total: number, isSubmitting: boolean): string {
  if (isSubmitting) return "Redirecting to checkout…";
  return `Checkout · ${formatMoney(total)}`;
}

export function guestCartMergedMessage(count: number): string {
  return `Added ${count} item${count === 1 ? "" : "s"} from before you signed in`;
}

export function itemRemovedMessage(name: string): string {
  return `${name} is no longer available and was removed from your cart.`;
}
