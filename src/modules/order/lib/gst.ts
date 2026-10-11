import { GST_DIVISOR } from "./pricingConstants";

/** Dollars (this codebase's stored unit) -> integer cents. The only dollars->cents conversion pricing maths should use. */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

function fromCents(cents: number): number {
  return cents / 100;
}

/** The one shared GST rounding rule: GST contained in a GST-inclusive amount, rounded half-up to the nearest cent. */
export function gstIncludedCents(totalCents: number): number {
  return Math.round(totalCents / GST_DIVISOR);
}

export interface OrderTotals {
  /** Sum of GST-inclusive menu prices, before any reward. */
  subtotal: number;
  /** Capped to <= subtotal. */
  discountAmount: number;
  /** What the customer actually pays — subtotal − discountAmount. Nothing is added on top. */
  total: number;
  /** Informational only — the GST already contained in `total`. */
  gstIncluded: number;
}

/**
 * The cart drawer's displayed figures and /api/checkout's authoritative
 * ones both come from here, in integer cents, so they can never round
 * differently.
 */
export function computeOrderTotals({ subtotal, discountAmount }: { subtotal: number; discountAmount: number }): OrderTotals {
  const subtotalCents = toCents(subtotal);
  const discountCents = Math.min(toCents(discountAmount), subtotalCents);
  const totalCents = subtotalCents - discountCents;

  return {
    subtotal: fromCents(subtotalCents),
    discountAmount: fromCents(discountCents),
    total: fromCents(totalCents),
    gstIncluded: fromCents(gstIncludedCents(totalCents)),
  };
}
