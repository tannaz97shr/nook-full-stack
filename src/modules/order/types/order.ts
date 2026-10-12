export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Cancelled";

/**
 * Admin-driven food-prep pipeline (Phase 6, out of scope here) — kept as
 * its own field rather than folded into PaymentStatus because the two are
 * driven by different actors on different timelines: PaymentStatus
 * resolves within seconds via Stripe/webhook, FulfillmentStatus spans
 * minutes and is set by cafe staff. Null until PaymentStatus is "Paid" —
 * there's nothing to fulfill yet.
 */
export type FulfillmentStatus = "Received" | "Preparing" | "Ready" | "Completed";

export interface OrderLineOption {
  optionId: string;
  name: string;
  priceModifier: number;
}

export interface OrderLineGroup {
  optionGroupId: string;
  optionGroupName: string;
  options: OrderLineOption[];
}

export interface OrderLineItem {
  menuItemId: string;
  /** Snapshotted server-side at order-creation time. */
  name: string;
  /** basePrice + selected priceModifiers, recomputed server-side — never client-trusted. */
  unitPrice: number;
  quantity: number;
  selections: OrderLineGroup[];
}

/**
 * Snapshotted at checkout-request time — a later catalog edit never
 * retroactively changes an already-placed order. Written once at order
 * creation and never mutated after; the points deduction it implies only
 * actually happens (once, atomically) when the order is confirmed Paid.
 */
export interface OrderRedemption {
  rewardId: string;
  /** Snapshotted server-side at order-creation time — a later catalog edit never changes how an already-placed order displays. */
  name: string;
  pointsCost: number;
  /** Dollars, same unit as subtotal/total — already capped to <= the pre-discount total. */
  discountAmount: number;
}

/**
 * How an order's tax was treated — orders are never migrated, so both
 * shapes coexist. "gst-inclusive": total is the sum of GST-inclusive menu
 * prices (less any reward) and gstIncluded is the informational GST
 * contained in it (total ÷ 11, cents-rounded). "legacy-tax-added": placed
 * before GST-inclusive pricing, when a 10% tax was added on top of
 * subtotal — displayed exactly as stored so its total stays what was
 * charged.
 */
export type OrderPricing =
  | { kind: "gst-inclusive"; gstIncluded: number }
  | { kind: "legacy-tax-added"; tax: number };

export interface Order {
  /** Firestore auto-generated document ID — see authorizeOrderAccess.ts for why. */
  id: string;
  /** Null for guest checkout. */
  userId: string | null;
  lineItems: OrderLineItem[];
  /** Sum of line items, before any reward. */
  subtotal: number;
  pricing: OrderPricing;
  /** Fixed constant at MVP (0 — pickup-only cafe, no delivery in scope). */
  shipping: number;
  /** What was charged. GST-inclusive orders: subtotal − (redemption?.discountAmount ?? 0). Legacy orders: subtotal + tax + shipping − discount. */
  total: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus | null;
  /** Null until the Stripe Checkout Session is successfully created. */
  stripeSessionId: string | null;
  processedStripeEventIds: string[];
  /** Null if no reward was redeemed on this order. */
  redemption: OrderRedemption | null;
  /**
   * Earning idempotency marker for the Completed-transition — a scalar
   * timestamp (not an array like processedStripeEventIds) since that
   * transition is a single one-shot action per order, unlike a
   * redeliverable Stripe webhook event. Null until awardPointsIfCompleted
   * fires successfully.
   */
  pointsAwardedAt: number | null;
  /** Snapshot of points actually credited, set alongside pointsAwardedAt. */
  pointsEarned: number | null;
  /**
   * Placed by the portfolio demo customer (see auth/lib/demoAccounts.ts).
   * Hidden from the real admin's queue and stats; the read-only
   * demo-admin sees them. False for every order placed before this field
   * existed.
   */
  isDemo: boolean;
  createdAt: number;
  updatedAt: number;
}
