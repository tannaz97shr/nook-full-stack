import { adminDb } from "@/shared/lib/firebase-admin";
import { AUTH_COLLECTIONS } from "../lib/collections";
import { toUser } from "../lib/toUser";
import type { User } from "../types/user";

/**
 * Server-only. Batch-resolves Users by id (id === lowercase email, see
 * getUserByEmail.ts) via getAll() rather than a where("__name__","in",...)
 * query — getAll() has no 30-item cap, so no chunking is needed. Ids with
 * no matching doc are simply absent from the returned map.
 */
export async function getUsersByIds(userIds: string[]): Promise<Map<string, User>> {
  const uniqueIds = Array.from(new Set(userIds));
  if (uniqueIds.length === 0) return new Map();

  const refs = uniqueIds.map((id) => adminDb.collection(AUTH_COLLECTIONS.users).doc(id));
  const snapshots = await adminDb.getAll(...refs);

  const usersById = new Map<string, User>();
  for (const snap of snapshots) {
    if (snap.exists) usersById.set(snap.id, toUser(snap));
  }
  return usersById;
}
