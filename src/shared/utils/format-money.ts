const MONEY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function roundToCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function formatMoney(amount: number): string {
  return MONEY_FORMATTER.format(roundToCents(amount));
}
