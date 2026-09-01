import { adminDb } from "@/shared/lib/firebase-admin";
import { MENU_COLLECTIONS } from "../lib/collections";
import { toOption } from "../lib/toOption";
import type { Option } from "../types/option";

/**
 * Server-only. Options by ID, fetched individually (rather than an `in`
 * query) to avoid Firestore's 30-value cap and stay correct at any list
 * size. Used to hydrate an OptionGroup's optionIds into real Options.
 * Missing IDs are silently skipped.
 */
export async function getOptionsByIds(ids: string[]): Promise<Option[]> {
  const docs = await Promise.all(
    ids.map((id) => adminDb.collection(MENU_COLLECTIONS.options).doc(id).get()),
  );

  return docs.filter((doc) => doc.exists).map(toOption);
}
