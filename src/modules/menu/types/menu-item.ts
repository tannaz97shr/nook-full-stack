export type DietaryTag = "vegan" | "gluten-free" | "dairy-free" | "contains-nuts";

export interface MenuItem {
  /** Firestore doc ID — the natural slug (e.g. "flat-white"). */
  id: string;
  /** References Category.id. */
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  /**
   * public/ paths for now. Real per-item photography goes through
   * Firebase Storage with token-gated URLs once the admin upload
   * pipeline exists (tracked in specs/known-issues.md).
   */
  images: string[];
  dietaryTags: DietaryTag[];
  /** The 86'd flag. */
  isAvailable: boolean;
  displayOrder: number;
  /** References OptionGroup.id — OptionGroups are standalone, not embedded. */
  optionGroupIds: string[];
}
