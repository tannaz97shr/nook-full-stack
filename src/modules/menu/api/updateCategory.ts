import { adminDb } from "@/shared/lib/firebase-admin";
import { MENU_COLLECTIONS } from "../lib/collections";
import { MenuEntityNotFoundError } from "../lib/errors";
import type { CategoryInput } from "../lib/categorySchema";
import type { Category } from "../types/category";

/** Never touches `id` — MenuItem.categoryId references it live. */
export async function updateCategory(id: string, input: CategoryInput): Promise<Category> {
  const ref = adminDb.collection(MENU_COLLECTIONS.categories).doc(id);
  const existing = await ref.get();
  if (!existing.exists) {
    throw new MenuEntityNotFoundError("Category", id);
  }

  const data = { name: input.name, description: input.description ?? null, isActive: input.isActive };
  await ref.update(data);

  return {
    id,
    name: data.name,
    description: data.description ?? undefined,
    displayOrder: existing.data()!.displayOrder,
    isActive: data.isActive,
  };
}
