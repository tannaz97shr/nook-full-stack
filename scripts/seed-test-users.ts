/**
 * Seeds two deterministic test accounts: test-customer@nook.local (role
 * customer) and test-admin@nook.local (role admin). Both are Credentials
 * users.
 *
 * Dry-run by default — only writes to Firestore with an explicit --apply
 * flag. Doc IDs are the lowercased email, so re-running --apply is a safe
 * upsert, not an additive duplicate-creator.
 *
 * Passwords: set TEST_CUSTOMER_PASSWORD / TEST_ADMIN_PASSWORD in your own
 * (gitignored) .env.local to control them yourself, or omit them and this
 * script generates one per account and prints it to your terminal ONCE on
 * --apply — copy it into a password manager immediately. Never written to
 * disk, never logged again, never pasted into chat.
 *
 * Usage:
 *   bun run scripts/seed-test-users.ts            # dry run, no writes
 *   bun run scripts/seed-test-users.ts --apply     # writes to Firestore
 */
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../src/shared/lib/firebase-admin";
import { AUTH_COLLECTIONS } from "../src/modules/auth/lib/collections";
import type { Role } from "../src/modules/auth/types/user";

interface TestAccount {
  email: string;
  name: string;
  role: Role;
  envVar: string;
}

const accounts: TestAccount[] = [
  { email: "test-customer@nook.local", name: "Test Customer", role: "customer", envVar: "TEST_CUSTOMER_PASSWORD" },
  { email: "test-admin@nook.local", name: "Test Admin", role: "admin", envVar: "TEST_ADMIN_PASSWORD" },
];

function resolvePassword(envVar: string): { password: string; generated: boolean } {
  const fromEnv = process.env[envVar];
  if (fromEnv) return { password: fromEnv, generated: false };
  return { password: randomBytes(18).toString("base64url"), generated: true };
}

async function main() {
  const apply = process.argv.includes("--apply");

  console.log(`${apply ? "[apply]" : "[dry-run]"} ${accounts.length} test users`);
  console.log();

  for (const account of accounts) {
    console.log(`  ${AUTH_COLLECTIONS.users}/${account.email} (${account.role})${apply ? "" : "  (planned)"}`);
  }

  if (!apply) {
    console.log();
    console.log("Dry run only — no writes made. Re-run with --apply to write to Firestore.");
    return;
  }

  console.log();
  for (const account of accounts) {
    const { password, generated } = resolvePassword(account.envVar);
    const passwordHash = await bcrypt.hash(password, 12);
    const now = FieldValue.serverTimestamp();

    const batch = adminDb.batch();
    batch.set(adminDb.collection(AUTH_COLLECTIONS.users).doc(account.email), {
      email: account.email,
      name: account.name,
      phone: null,
      role: account.role,
      authProvider: "credentials",
      pointsBalance: 0,
      activeRedemptionOrderId: null,
      createdAt: now,
      updatedAt: now,
    });
    batch.set(adminDb.collection(AUTH_COLLECTIONS.credentials).doc(account.email), {
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });
    await batch.commit();

    console.log(`Wrote ${account.email}.`);
    if (generated) {
      console.log(`  generated password (copy now, shown once): ${password}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
