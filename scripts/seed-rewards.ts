/**
 * Seeds the rewards collection with the values previously hardcoded in
 * src/modules/loyalty/content/rewardsCatalog.ts.
 *
 * Dry-run by default — only writes to Firestore with an explicit --apply
 * flag. Doc IDs are deterministic natural slugs, so re-running --apply is
 * a safe upsert, not an additive duplicate-creator.
 *
 * Usage:
 *   bun run scripts/seed-rewards.ts            # dry run, no writes
 *   bun run scripts/seed-rewards.ts --apply     # writes to Firestore
 */
import { adminDb } from "../src/shared/lib/firebase-admin";
import { LOYALTY_COLLECTIONS } from "../src/modules/loyalty/lib/collections";
import type { RewardCatalogItem } from "../src/modules/loyalty/types/reward";

const rewards: RewardCatalogItem[] = [
  {
    id: "drip-coffee",
    name: "Free drip coffee",
    description: "Any size, any roast.",
    pointsCost: 150,
    discountValue: 4.25,
    isActive: true,
  },
  {
    id: "pastry",
    name: "Free pastry",
    description: "Whatever's in the case that day.",
    pointsCost: 250,
    discountValue: 5.5,
    isActive: true,
  },
  {
    id: "large-coffee",
    name: "Free large coffee",
    description: "Espresso drinks included.",
    pointsCost: 500,
    discountValue: 6.75,
    isActive: true,
  },
  {
    id: "bag-of-beans",
    name: "Bag of beans",
    description: "Take the house blend home.",
    pointsCost: 900,
    discountValue: 16,
    isActive: true,
  },
];

function withoutId<T extends { id: string }>({ id, ...rest }: T): Omit<T, "id"> {
  return rest;
}

async function main() {
  const apply = process.argv.includes("--apply");

  console.log(`${apply ? "[apply]" : "[dry-run]"} ${rewards.length} docs: ${rewards.length} rewards`);
  console.log();

  for (const reward of rewards) {
    console.log(`  ${LOYALTY_COLLECTIONS.rewards}/${reward.id}${apply ? "" : "  (planned)"}`);
  }

  if (!apply) {
    console.log();
    console.log("Dry run only — no writes made. Re-run with --apply to write to Firestore.");
    return;
  }

  const batch = adminDb.batch();
  for (const reward of rewards) {
    batch.set(adminDb.collection(LOYALTY_COLLECTIONS.rewards).doc(reward.id), withoutId(reward));
  }
  await batch.commit();

  console.log();
  console.log(`Wrote ${rewards.length} docs to Firestore.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
