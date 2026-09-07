import { adminDb } from "@/shared/lib/firebase-admin";
import { MENU_COLLECTIONS } from "../lib/collections";
import { DuplicateSlugError } from "../lib/errors";
import { slugify } from "../lib/slugify";
import type { CategoryInput } from "../lib/categorySchema";
import type { Category } from "../types/category";

/** New categories append at the end — displayOrder is server-computed, never client-submitted. */
export async function createCategory(input: CategoryInput): Promise<Category> {
  const id = slugify(input.name);

  return adminDb.runTransaction(async (tx) => {
    const ref = adminDb.collection(MENU_COLLECTIONS.categories).doc(id);
    const [existing, categoriesSnap] = await Promise.all([
      tx.get(ref),
      tx.get(adminDb.collection(MENU_COLLECTIONS.categories).orderBy("displayOrder")),
    ]);

    if (existing.exists) {
      throw new DuplicateSlugError(MENU_COLLECTIONS.categories, id);
    }

    const displayOrder = categoriesSnap.empty
      ? 0
      : categoriesSnap.docs[categoriesSnap.docs.length - 1].data().displayOrder + 1;

    const data = {
      name: input.name,
      description: input.description ?? null,
      displayOrder,
      isActive: input.isActive,
    };
    tx.set(ref, data);

    return { id, name: data.name, description: data.description ?? undefined, displayOrder, isActive: data.isActive };
  });
}
