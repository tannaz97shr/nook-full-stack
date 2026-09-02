/**
 * Throwaway script — verifies the seeded test accounts round-trip
 * correctly through the real mapper/api functions. Deliberately never
 * prints passwordHash. Delete after use.
 */
import { getUserByEmail } from "../src/modules/auth/api/getUserByEmail";

const emails = ["test-customer@nook.local", "test-admin@nook.local"];

async function main() {
  for (const email of emails) {
    const user = await getUserByEmail(email);
    if (!user) {
      console.log(`${email}: NOT FOUND`);
      continue;
    }
    console.log(`${email}: role=${user.role} authProvider=${user.authProvider} name=${user.name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
