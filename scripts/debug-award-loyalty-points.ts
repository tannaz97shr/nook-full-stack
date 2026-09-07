/**
 * Tops up a real account's loyalty pointsBalance just enough to redeem a
 * given reward — reuses an existing eligible Paid order if one qualifies,
 * otherwise creates a synthetic Paid test order first. Calls the same
 * awardPointsIfCompleted() transaction the QA-only /api/debug/mark-order-completed
 * route uses, just invoked in-process instead of over HTTP (that route's
 * requireAdminSession() only guards the HTTP wrapper, not the function itself).
 *
 * Dry-run by default — only writes to Firestore with an explicit --apply
 * flag.
 *
 * Usage:
 *   bun run scripts/debug-award-loyalty-points.ts            # dry run
 *   bun run scripts/debug-award-loyalty-points.ts --apply     # writes
 */
import { FieldValue } from "firebase-admin/firestore";
import { getUserByEmail } from "../src/modules/auth/api/getUserByEmail";
import { REWARDS_CATALOG } from "../src/modules/loyalty/content/rewardsCatalog";
import { awardPointsIfCompleted } from "../src/modules/loyalty/api/awardPointsIfCompleted";
import { getOrdersByUserId } from "../src/modules/order/api/getOrdersByUserId";
import { ORDER_COLLECTIONS } from "../src/modules/order/lib/collections";
import { adminDb } from "../src/shared/lib/firebase-admin";

const TARGET_EMAIL = "tia.shr97@gmail.com";
const REWARD_ID = "drip-coffee";

async function main() {
  const apply = process.argv.includes("--apply");

  const reward = REWARDS_CATALOG.find((r) => r.id === REWARD_ID);
  if (!reward) throw new Error(`Reward "${REWARD_ID}" not found in REWARDS_CATALOG`);

  const user = await getUserByEmail(TARGET_EMAIL);
  if (!user) throw new Error(`No user found for ${TARGET_EMAIL}`);

  console.log(`${apply ? "[apply]" : "[dry-run]"} ${TARGET_EMAIL}`);
  console.log(`  current pointsBalance: ${user.pointsBalance}`);
  console.log(`  reward: "${reward.name}" costs ${reward.pointsCost} pts`);

  const pointsNeeded = Math.max(0, reward.pointsCost - user.pointsBalance);
  if (pointsNeeded === 0) {
    console.log(`  already has enough points to redeem "${reward.name}". No changes made.`);
    return;
  }
  console.log(`  points needed: ${pointsNeeded}`);

  const orders = await getOrdersByUserId(TARGET_EMAIL);
  const eligible = orders
    .filter((o) => o.paymentStatus === "Paid" && o.pointsAwardedAt === null && Math.floor(o.subtotal) >= pointsNeeded)
    .sort((a, b) => a.subtotal - b.subtotal);

  let orderId: string;
  let mode: "reuse" | "create";

  if (eligible.length > 0) {
    orderId = eligible[0].id;
    mode = "reuse";
    console.log(`  reusing existing order ${orderId} (subtotal $${eligible[0].subtotal})`);
  } else {
    mode = "create";
    console.log(`  no eligible existing order found — will create a new Paid test order with subtotal $${pointsNeeded}`);
    if (!apply) {
      console.log();
      console.log("Dry run only — no writes made. Re-run with --apply to write to Firestore.");
      return;
    }

    const now = FieldValue.serverTimestamp();
    const orderRef = adminDb.collection(ORDER_COLLECTIONS.orders).doc();
    await orderRef.set({
      userId: TARGET_EMAIL,
      lineItems: [
        {
          menuItemId: "debug-loyalty-topup",
          name: "Debug loyalty top-up",
          unitPrice: pointsNeeded,
          quantity: 1,
          selections: [],
        },
      ],
      subtotal: pointsNeeded,
      tax: 0,
      shipping: 0,
      total: pointsNeeded,
      paymentStatus: "Paid",
      fulfillmentStatus: "Received",
      stripeSessionId: null,
      processedStripeEventIds: [],
      redemption: null,
      pointsAwardedAt: null,
      pointsEarned: null,
      createdAt: now,
      updatedAt: now,
    });
    orderId = orderRef.id;
    console.log(`  created order ${orderId}`);
  }

  if (!apply) {
    console.log();
    console.log("Dry run only — no writes made. Re-run with --apply to write to Firestore.");
    return;
  }

  const result = await awardPointsIfCompleted(orderId);
  console.log(`  awardPointsIfCompleted(${orderId}) -> ${result}`);

  const updatedUser = await getUserByEmail(TARGET_EMAIL);
  console.log();
  console.log(`New pointsBalance: ${updatedUser?.pointsBalance}`);
  console.log(`Can redeem "${reward.name}" (${reward.pointsCost} pts): ${(updatedUser?.pointsBalance ?? 0) >= reward.pointsCost}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
