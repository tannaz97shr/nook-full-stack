import type { RewardCatalogItem } from "../types/reward";

/**
 * Single source of truth for the rewards catalog — imported by both the
 * account rewards page and /api/checkout's server-side re-verification.
 * Never duplicate these values elsewhere. Static constants, not a
 * Firestore collection: admin catalog management doesn't exist yet
 * (Phase 6), and a code-owned catalog can still be re-verified server-side
 * just as safely as a Firestore one would be.
 *
 * Each reward is a flat dollar credit, not a specific free menu item — the
 * catalog names are marketing copy; redemption never checks cart contents
 * for a matching item.
 */
export const REWARDS_CATALOG: RewardCatalogItem[] = [
  { id: "drip-coffee", name: "Free drip coffee", description: "Any size, any roast.", pointsCost: 150, discountValue: 4.25 },
  { id: "pastry", name: "Free pastry", description: "Whatever's in the case that day.", pointsCost: 250, discountValue: 5.5 },
  { id: "large-coffee", name: "Free large coffee", description: "Espresso drinks included.", pointsCost: 500, discountValue: 6.75 },
  { id: "bag-of-beans", name: "Bag of beans", description: "Take the house blend home.", pointsCost: 900, discountValue: 16 },
];
