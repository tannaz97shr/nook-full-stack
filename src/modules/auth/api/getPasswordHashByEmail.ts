import { adminDb } from "@/shared/lib/firebase-admin";
import { AUTH_COLLECTIONS } from "../lib/collections";

/** Server-only. The stored password hash for a Credentials user, or null. */
export async function getPasswordHashByEmail(email: string): Promise<string | null> {
  const doc = await adminDb.collection(AUTH_COLLECTIONS.credentials).doc(email).get();
  const data = doc.data();
  return data ? (data.passwordHash as string) : null;
}
