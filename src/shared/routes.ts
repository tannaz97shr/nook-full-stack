/**
 * Single source of truth for page routes. No hardcoded path strings
 * anywhere else in the app — import ROUTES (or a helper below) instead.
 *
 * Cart is a drawer overlay, not a route — deliberate. See
 * design/Nook-standalone-src.dc.html: there is no cart screen gate, only
 * a `cartOpen` overlay state layered on top of whichever screen is active.
 */
export const ROUTES = {
  home: "/",
  menu: "/menu",
  gallery: "/gallery",
  about: "/about",
  contact: "/contact",

  // `/sign-up` renders the same Auth module component in signup mode —
  // the design toggles this internally, but a distinct URL is worth it
  // for linkable "create an account" CTAs and post-signup analytics.
  signIn: "/sign-in",
  signUp: "/sign-up",

  account: {
    root: "/account",
    orders: "/account/orders",
    order: (orderId: string) => `/account/orders/${orderId}`,
    rewards: "/account/rewards",
  },

  // Publicly reachable by design (guest checkout is in scope). Phase 2
  // must make the order id unguessable and/or verify the Stripe session
  // id server-side before rendering — do not rely on obscurity.
  orderConfirmation: (orderId: string) => `/order-confirmation/${orderId}`,

  admin: {
    // No admin dashboard screen exists in the design — `/admin` should
    // redirect to `/admin/orders`.
    root: "/admin",
    orders: "/admin/orders",
    menu: "/admin/menu",
    loyalty: "/admin/loyalty",
  },
} as const;

/** For the future proxy.ts matcher and nav active-state checks. */
export const PROTECTED_ROUTE_PREFIXES = ["/account"] as const;
export const ADMIN_ROUTE_PREFIX = "/admin";

/** Auth.js v5's own callback param name — reuse it rather than inventing one. */
export const AUTH_CALLBACK_PARAM = "callbackUrl";

export function signInWithCallback(callbackUrl: string): string {
  return `${ROUTES.signIn}?${new URLSearchParams({ [AUTH_CALLBACK_PARAM]: callbackUrl })}`;
}

export function signUpWithCallback(callbackUrl: string): string {
  return `${ROUTES.signUp}?${new URLSearchParams({ [AUTH_CALLBACK_PARAM]: callbackUrl })}`;
}
