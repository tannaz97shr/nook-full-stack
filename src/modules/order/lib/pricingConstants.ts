/**
 * Single source of truth for GST/shipping — fixed constants at MVP, not
 * admin-configurable (see CLAUDE.md). Menu prices are GST-inclusive
 * (Australian consumer pricing), so GST is never added on top: the GST
 * contained in a total is total ÷ GST_DIVISOR (10% GST → 1/11 of the
 * inclusive price). Every item is treated as GST-taxable at MVP — see
 * specs/known-issues.md.
 */
export const GST_DIVISOR = 11;

/** Pickup-only cafe — no delivery in scope, kept as a named constant so a future delivery feature has one obvious place to change it. */
export const SHIPPING_FLAT = 0;
