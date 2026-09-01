import { adminDb } from "@/shared/lib/firebase-admin";
import { MENU_COLLECTIONS } from "../lib/collections";
import { toMenuItem } from "../lib/toMenuItem";
import type { MenuItem } from "../types/menu-item";

/** Server-only. MenuItems in a category, ordered by displayOrder. */
export async function getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
  const snapshot = await adminDb
    .collection(MENU_COLLECTIONS.menuItems)
    .where("categoryId", "==", categoryId)
    .orderBy("displayOrder")
    .get();

  return snapshot.docs.map(toMenuItem);
}

/** Server-only. A single MenuItem by ID, or null if it doesn't exist. */
export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const doc = await adminDb.collection(MENU_COLLECTIONS.menuItems).doc(id).get();
  return doc.exists ? toMenuItem(doc) : null;
}
