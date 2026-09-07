import { getAllMenuItems, getAllOptionGroups, getAllOptions, getCategories } from "@/modules/menu/api";
import { AdminMenuScreen } from "@/modules/menu/components/AdminMenuScreen";

export default async function AdminMenuPage() {
  const [categories, items, optionGroups, options] = await Promise.all([
    getCategories(),
    getAllMenuItems(),
    getAllOptionGroups(),
    getAllOptions(),
  ]);

  return <AdminMenuScreen categories={categories} items={items} optionGroups={optionGroups} options={options} />;
}
