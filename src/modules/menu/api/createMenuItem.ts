import { adminDb } from "@/shared/lib/firebase-admin";
import { MENU_COLLECTIONS } from "../lib/collections";
import { DuplicateSlugError } from "../lib/errors";
import { slugify } from "../lib/slugify";
import type { MenuItemInput } from "../lib/menuItemSchema";
import type { MenuItem } from "../types/menu-item";

/** New items append at the end within their category — displayOrder is server-computed. */
export async function createMenuItem(input: MenuItemInput): Promise<MenuItem> {
  const id = slugify(input.name);

  return adminDb.runTransaction(async (tx) => {
    const ref = adminDb.collection(MENU_COLLECTIONS.menuItems).doc(id);
    const [existing, itemsInCategory] = await Promise.all([
      tx.get(ref),
      tx.get(
        adminDb
          .collection(MENU_COLLECTIONS.menuItems)
          .where("categoryId", "==", input.categoryId)
          .orderBy("displayOrder"),
      ),
    ]);

    if (existing.exists) {
      throw new DuplicateSlugError(MENU_COLLECTIONS.menuItems, id);
    }

    const displayOrder = itemsInCategory.empty
      ? 0
      : itemsInCategory.docs[itemsInCategory.docs.length - 1].data().displayOrder + 1;

    const data = {
      categoryId: input.categoryId,
      name: input.name,
      description: input.description,
      basePrice: input.basePrice,
      images: input.images,
      dietaryTags: input.dietaryTags,
      isAvailable: input.isAvailable,
      displayOrder,
      optionGroupIds: input.optionGroupIds,
    };
    tx.set(ref, data);

    return { id, ...data };
  });
}
