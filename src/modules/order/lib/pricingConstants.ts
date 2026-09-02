/**
 * Single source of truth for tax/shipping — fixed constants at MVP, not
 * admin-configurable (see CLAUDE.md). cart/content/cartContent.ts
 * re-exports TAX_RATE from here rather than declaring its own, so the
 * cart drawer's displayed total and this route's authoritative total can
 * never drift apart.
 */
export const TAX_RATE = 0.1;

/** Pickup-only cafe — no delivery in scope, kept as a named constant so a future delivery feature has one obvious place to change it. */
export const SHIPPING_FLAT = 0;
