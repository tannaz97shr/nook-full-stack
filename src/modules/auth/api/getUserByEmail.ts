import { adminDb } from "@/shared/lib/firebase-admin";
import { AUTH_COLLECTIONS } from "../lib/collections";
import { toUser } from "../lib/toUser";
import type { User } from "../types/user";

/** Server-only. A single User by email (doc id = lowercase email), or null. */
export async function getUserByEmail(email: string): Promise<User | null> {
  const doc = await adminDb.collection(AUTH_COLLECTIONS.users).doc(email).get();
  return doc.exists ? toUser(doc) : null;
}
