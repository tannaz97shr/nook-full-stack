import { adminDb } from "@/shared/lib/firebase-admin";
import { MENU_COLLECTIONS } from "../lib/collections";
import { HOMEPAGE_FEATURED_LIMIT } from "../lib/featured";
import { toMenuItem } from "../lib/toMenuItem";
import type { MenuItem } from "../types/menu-item";
import { getCategories } from "./getCategories";

/**
 * Server-only. Featured items that a customer can actually order right now:
 * available (not 86'd) and in an active category. Sorted the way /menu shows
 * them (category order, then item order) and capped at
 * HOMEPAGE_FEATURED_LIMIT. Sorting happens in memory so the equality filter
 * needs no composite index.
 */
export async function getFeaturedMenuItems(): Promise<MenuItem[]> {
  const [snapshot, categories] = await Promise.all([
    adminDb.collection(MENU_COLLECTIONS.menuItems).where("isFeatured", "==", true).get(),
    getCategories(),
  ]);

  const categoryOrder = new Map(
    categories.filter((category) => category.isActive).map((category) => [category.id, category.displayOrder]),
  );

  return snapshot.docs
    .map(toMenuItem)
    .filter((item) => item.isAvailable && categoryOrder.has(item.categoryId))
    .sort(
      (a, b) =>
        categoryOrder.get(a.categoryId)! - categoryOrder.get(b.categoryId)! ||
        a.displayOrder - b.displayOrder,
    )
    .slice(0, HOMEPAGE_FEATURED_LIMIT);
}
