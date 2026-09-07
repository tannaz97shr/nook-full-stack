import { adminDb } from "@/shared/lib/firebase-admin";
import { MENU_COLLECTIONS } from "../lib/collections";
import { MenuEntityNotFoundError } from "../lib/errors";
import type { MenuItemInput } from "../lib/menuItemSchema";
import type { MenuItem } from "../types/menu-item";

/** Never touches `id` or `displayOrder` — reordering is a separate concern from editing. */
export async function updateMenuItem(id: string, input: MenuItemInput): Promise<MenuItem> {
  const ref = adminDb.collection(MENU_COLLECTIONS.menuItems).doc(id);
  const existing = await ref.get();
  if (!existing.exists) {
    throw new MenuEntityNotFoundError("MenuItem", id);
  }

  const data = {
    categoryId: input.categoryId,
    name: input.name,
    description: input.description,
    basePrice: input.basePrice,
    images: input.images,
    dietaryTags: input.dietaryTags,
    isAvailable: input.isAvailable,
    optionGroupIds: input.optionGroupIds,
  };
  await ref.update(data);

  return { id, ...data, displayOrder: existing.data()!.displayOrder };
}
