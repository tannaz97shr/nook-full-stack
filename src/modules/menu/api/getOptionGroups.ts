import { adminDb } from "@/shared/lib/firebase-admin";
import { MENU_COLLECTIONS } from "../lib/collections";
import { toOptionGroup } from "../lib/toOptionGroup";
import type { OptionGroup } from "../types/option-group";

/**
 * Server-only. OptionGroups by ID, fetched individually (rather than an
 * `in` query) to avoid Firestore's 30-value cap and stay correct at any
 * list size. Missing IDs are silently skipped.
 */
export async function getOptionGroupsByIds(ids: string[]): Promise<OptionGroup[]> {
  const docs = await Promise.all(
    ids.map((id) => adminDb.collection(MENU_COLLECTIONS.optionGroups).doc(id).get()),
  );

  return docs.filter((doc) => doc.exists).map(toOptionGroup);
}

/** Server-only. A single OptionGroup by ID, or null if it doesn't exist. */
export async function getOptionGroupById(id: string): Promise<OptionGroup | null> {
  const doc = await adminDb.collection(MENU_COLLECTIONS.optionGroups).doc(id).get();
  return doc.exists ? toOptionGroup(doc) : null;
}

/** Server-only, admin use. Every OptionGroup, including ones not currently referenced by any MenuItem. */
export async function getAllOptionGroups(): Promise<OptionGroup[]> {
  const snapshot = await adminDb.collection(MENU_COLLECTIONS.optionGroups).get();
  return snapshot.docs.map(toOptionGroup);
}
