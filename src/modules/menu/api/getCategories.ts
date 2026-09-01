import { adminDb } from "@/shared/lib/firebase-admin";
import { MENU_COLLECTIONS } from "../lib/collections";
import { toCategory } from "../lib/toCategory";
import type { Category } from "../types/category";

/** Server-only. All categories, ordered by displayOrder. */
export async function getCategories(): Promise<Category[]> {
  const snapshot = await adminDb
    .collection(MENU_COLLECTIONS.categories)
    .orderBy("displayOrder")
    .get();

  return snapshot.docs.map(toCategory);
}
