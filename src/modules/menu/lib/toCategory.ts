import type { DocumentSnapshot } from "firebase-admin/firestore";
import type { Category } from "../types/category";

export function toCategory(doc: DocumentSnapshot): Category {
  const data = doc.data();
  if (!data) {
    throw new Error(`Category document ${doc.id} does not exist`);
  }

  return {
    id: doc.id,
    name: data.name,
    description: data.description ?? undefined,
    displayOrder: data.displayOrder,
    isActive: data.isActive,
  };
}
