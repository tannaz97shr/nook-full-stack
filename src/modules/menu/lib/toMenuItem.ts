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
    displayOrder: data.displayOrder,
    optionGroupIds: data.optionGroupIds,
  };
}
