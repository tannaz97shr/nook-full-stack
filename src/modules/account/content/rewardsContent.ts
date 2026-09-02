/**
 * PHASE 5b BOUNDARY: every value below is static placeholder content, not
 * data. No points math, no Firestore-backed balance, no per-order accrual
 * — User/Order have no loyalty fields yet. Phase 5b must add those fields,
 * build real accrual/redemption logic, and replace every value here (and
 * the uniformly-disabled Redeem buttons in RewardsShell) with real
 * computed data before this file can go away.
 */

export const REWARDS_HEADING = "Rewards";

export const REWARDS_HERO = {
  label: "Points balance",
  points: 0,
  goal: 500,
  nudge: "Order something and your points will start adding up here.",
};

export const REWARDS_STATS = [
  { label: "Earned this year", value: "—" },
  { label: "Redeemed", value: "—" },
  { label: "Rate", value: "1 pt / $1" },
];

export interface RewardCatalogItem {
  id: string;
  cost: string;
  name: string;
  description: string;
}

export const REWARDS_CATALOG: RewardCatalogItem[] = [
  { id: "drip-coffee", cost: "150 pts", name: "Free drip coffee", description: "Any size, any roast." },
  { id: "pastry", cost: "250 pts", name: "Free pastry", description: "Whatever's in the case that day." },
  { id: "large-coffee", cost: "500 pts", name: "Free large coffee", description: "Espresso drinks included." },
  { id: "bag-of-beans", cost: "900 pts", name: "Bag of beans", description: "Take the house blend home." },
];

export const REWARDS_CATALOG_HEADING = "Rewards you can redeem";
export const REWARDS_REDEEM_LABEL = "Redeem";
export const REWARDS_REDEEM_DEFERRED_TITLE = "Redeeming rewards is coming soon";
export const REWARDS_FOOTNOTE =
  "Points land the moment an order is marked complete. Orders placed as a guest can't be added to a balance afterwards — worth signing in first if you're close to a reward.";
