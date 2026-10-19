/**
 * The cafe's one currency. Display formatting (`formatMoney`) and Stripe
 * (`STRIPE_CURRENCY` in order/lib/pricingConstants.ts) both derive from
 * this, so the amount shown and the amount charged can never disagree.
 * Amounts are stored as dollars and converted to integer cents only at the
 * Stripe boundary (`toCents` in order/lib/gst.ts).
 */
export const CURRENCY_CODE = "AUD";
export const CURRENCY_LOCALE = "en-AU";
