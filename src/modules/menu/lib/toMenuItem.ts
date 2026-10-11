import type { DocumentSnapshot } from "firebase-admin/firestore";
import type { MenuItem } from "../types/menu-item";

export function toMenuItem(doc: DocumentSnapshot): MenuItem {
  const data = doc.data();
  if (!data) {
    throw new Error(`MenuItem document ${doc.id} does not exist`);
  }

  return {
    id: doc.id,
    categoryId: data.categoryId,
    name: data.name,
    description: data.description,
    basePrice: data.basePrice,
    images: data.images,
    dietaryTags: data.dietaryTags,
    isAvailable: data.isAvailable,
    // Docs written before the field existed have no isFeatured — read as
    // false, so no migration script is needed.
    isFeatured: data.isFeatured === true,
    displayOrder: data.displayOrder,
    optionGroupIds: data.optionGroupIds,
  };
}
