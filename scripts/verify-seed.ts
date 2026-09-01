/**
 * Throwaway script — verifies seeded Firestore data round-trips correctly
 * through the real mapper/api functions. Delete after use.
 */
import { getCategories } from "../src/modules/menu/api/getCategories";
import { getMenuItemsByCategory } from "../src/modules/menu/api/getMenuItems";
import { getOptionGroupsByIds } from "../src/modules/menu/api/getOptionGroups";
import { getOptionsByIds } from "../src/modules/menu/api/getOptions";

async function main() {
  console.log("=== getCategories() ===");
  const categories = await getCategories();
  console.dir(categories, { depth: null });

  console.log();
  console.log("=== getMenuItemsByCategory(id) for each category ===");
  for (const category of categories) {
    const items = await getMenuItemsByCategory(category.id);
    console.log(`--- ${category.id} (${items.length} items) ---`);
    console.dir(items, { depth: null });
  }

  console.log();
  console.log('=== getOptionGroupsByIds(["plate-extras"]) ===');
  const [plateExtras] = await getOptionGroupsByIds(["plate-extras"]);
  console.dir(plateExtras, { depth: null });

  console.log();
  console.log("=== getOptionsByIds(plateExtras.optionIds) ===");
  const plateExtrasOptions = await getOptionsByIds(plateExtras.optionIds);
  console.dir(plateExtrasOptions, { depth: null });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
