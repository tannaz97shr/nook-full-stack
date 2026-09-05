export interface RewardCatalogItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  /** Dollars — matches subtotal/tax/total/unitPrice's existing convention; cents conversion happens only at the Stripe API boundary. */
  discountValue: number;
}
