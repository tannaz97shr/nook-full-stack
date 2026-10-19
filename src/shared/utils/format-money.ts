import { CURRENCY_CODE, CURRENCY_LOCALE } from "@/shared/currency";

// en-AU renders AUD as "$4.50" (not "A$4.50"), matching the cafe's local pricing.
const MONEY_FORMATTER = new Intl.NumberFormat(CURRENCY_LOCALE, {
  style: "currency",
  currency: CURRENCY_CODE,
});

export function roundToCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function formatMoney(amount: number): string {
  return MONEY_FORMATTER.format(roundToCents(amount));
}
