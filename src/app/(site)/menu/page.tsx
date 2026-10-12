import {
  getCategories,
  getMenuItemsByCategory,
  getOptionGroupsByIds,
  getOptionsByIds,
} from "@/modules/menu/api";
import { MenuScreen } from "@/modules/menu/components/MenuScreen";
import type { MenuItem, Option, OptionGroup } from "@/modules/menu/types";

export default async function MenuPage() {
  const allCategories = await getCategories();
  const activeCategories = allCategories.filter((category) => category.isActive);

  const itemsByCategory = await Promise.all(
    activeCategories.map((category) => getMenuItemsByCategory(category.id)),
  );

  // Empty categories don't render a tab at all, per the spec.
  const categoriesWithItems = activeCategories
    .map((category, index) => ({ category, items: itemsByCategory[index] }))
    .filter(({ items }) => items.length > 0);

  const allItems: MenuItem[] = categoriesWithItems.flatMap(({ items }) => items);

  const optionGroupIds = Array.from(new Set(allItems.flatMap((item) => item.optionGroupIds)));
  const optionGroups = await getOptionGroupsByIds(optionGroupIds);

  const optionIds = Array.from(new Set(optionGroups.flatMap((group) => group.optionIds)));
  const options = await getOptionsByIds(optionIds);

  const menuItemsById: Record<string, MenuItem> = Object.fromEntries(
    allItems.map((item) => [item.id, item]),
  );
  const optionGroupsById: Record<string, OptionGroup> = Object.fromEntries(
    optionGroups.map((group) => [group.id, group]),
  );
  const optionsById: Record<string, Option> = Object.fromEntries(
    options.map((option) => [option.id, option]),
  );

  return (
    <MenuScreen
      categories={categoriesWithItems.map(({ category, items }) => ({
        id: category.id,
        name: category.name,
        count: items.length,
      }))}
      itemsByCategoryId={Object.fromEntries(
        categoriesWithItems.map(({ category, items }) => [category.id, items]),
      )}
      menuItemsById={menuItemsById}
      optionGroupsById={optionGroupsById}
      optionsById={optionsById}
    />
  );
}
