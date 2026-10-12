/**
 * Seeds the two portfolio demo accounts from DEMO_ACCOUNTS:
 * demo-customer@nook.local (role customer) and demo-admin@nook.local
 * (role demo-admin, read-only). Both have authProvider "demo".
 *
 * Passwordless by design: no credentials doc is written, and any stray
 * one for these emails is deleted, so the email/password form can never
 * sign into them. The only way in is the "demo" provider in src/auth.ts,
 * and only while DEMO_ACCESS_ENABLED=true.
 *
 * Dry-run by default — only writes to Firestore with an explicit --apply
 * flag. Doc IDs are the lowercased email, so re-running --apply is a safe
 * reset (pointsBalance back to 0, redemption lock cleared).
 *
 * Usage:
 *   bun run scripts/seed-demo-users.ts            # dry run, no writes
 *   bun run scripts/seed-demo-users.ts --apply     # writes to Firestore
 */
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../src/shared/lib/firebase-admin";
import { AUTH_COLLECTIONS } from "../src/modules/auth/lib/collections";
import { DEMO_ACCOUNTS } from "../src/modules/auth/lib/demoAccounts";

async function main() {
  const apply = process.argv.includes("--apply");
  const accounts = Object.values(DEMO_ACCOUNTS);

  console.log(`${apply ? "[apply]" : "[dry-run]"} ${accounts.length} demo users`);
  console.log();

  for (const account of accounts) {
    const [userSnap, credentialsSnap] = await Promise.all([
      adminDb.collection(AUTH_COLLECTIONS.users).doc(account.email).get(),
      adminDb.collection(AUTH_COLLECTIONS.credentials).doc(account.email).get(),
    ]);

    console.log(`  ${AUTH_COLLECTIONS.users}/${account.email} (${account.role}, authProvider demo)${apply ? "" : "  (planned)"}`);
    if (userSnap.exists && userSnap.data()?.authProvider !== "demo") {
      console.log(`    warning: existing doc has authProvider "${userSnap.data()?.authProvider}" — it will be overwritten`);
    }
    if (credentialsSnap.exists) {
      console.log(`    ${AUTH_COLLECTIONS.credentials}/${account.email} exists — ${apply ? "deleting" : "will be deleted"}`);
    }
  }

  if (!apply) {
    console.log();
    console.log("Dry run only — no writes made. Re-run with --apply to write to Firestore.");
    return;
  }

  console.log();
  for (const account of accounts) {
    const now = FieldValue.serverTimestamp();
    const batch = adminDb.batch();
    batch.set(adminDb.collection(AUTH_COLLECTIONS.users).doc(account.email), {
      email: account.email,
      name: account.name,
      phone: null,
      role: account.role,
      authProvider: "demo",
      pointsBalance: 0,
      activeRedemptionOrderId: null,
      createdAt: now,
      updatedAt: now,
    });
    batch.delete(adminDb.collection(AUTH_COLLECTIONS.credentials).doc(account.email));
    await batch.commit();

    console.log(`Wrote ${account.email}.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
