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
   * Two valid shapes coexist: seeded items (scripts/seed-menu.ts) use
   * public/ paths; admin-added/replaced photos are token-gated Firebase
   * Storage download URLs (src/modules/menu/api/uploadMenuItemImage.ts).
   */
  images: string[];
  dietaryTags: DietaryTag[];
  /** The 86'd flag. */
  isAvailable: boolean;
  /** Shown in the homepage "Popular this week" row (up to HOMEPAGE_FEATURED_LIMIT, available items only). */
  isFeatured: boolean;
  displayOrder: number;
  /** References OptionGroup.id — OptionGroups are standalone, not embedded. */
  optionGroupIds: string[];
}
