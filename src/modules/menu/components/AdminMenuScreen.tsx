"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminMenuTabs } from "./AdminMenuTabs";
import { AdminItemsTable } from "./AdminItemsTable";
import { AdminItemForm } from "./AdminItemForm";
import { AdminCategoriesTable } from "./AdminCategoriesTable";
import { AdminCategoryForm } from "./AdminCategoryForm";
import { AdminOptionGroupsGrid } from "./AdminOptionGroupsGrid";
import { AdminOptionGroupForm } from "./AdminOptionGroupForm";
import type { AdminMenuTabId } from "../content/adminMenuContent";
import type { Category, MenuItem, Option, OptionGroup } from "../types";

export interface AdminMenuScreenProps {
  categories: Category[];
  items: MenuItem[];
  optionGroups: OptionGroup[];
  options: Option[];
}

type ItemModalState = { mode: "create" } | { mode: "edit"; item: MenuItem } | null;
type CategoryModalState = { mode: "create" } | { mode: "edit"; category: Category } | null;
type GroupModalState = { mode: "create" } | { mode: "edit"; group: OptionGroup } | null;

/**
 * Menu catalog data is RSC-fetched (see admin/menu/page.tsx) — mutations
 * close their modal and call router.refresh(), which re-runs the server
 * component for fresh data. No parallel client-side cache.
 *
 * Each *Form is only mounted while its modal state is non-null (not
 * always-mounted with an `open` boolean prop) so its useForm() defaultValues
 * are recomputed fresh every time it opens for a different/new target,
 * rather than persisting stale values from a previous edit session.
 */
export function AdminMenuScreen({ categories, items, optionGroups, options }: AdminMenuScreenProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminMenuTabId>("items");
  const [itemModal, setItemModal] = useState<ItemModalState>(null);
  const [categoryModal, setCategoryModal] = useState<CategoryModalState>(null);
  const [groupModal, setGroupModal] = useState<GroupModalState>(null);

  const categoriesById = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category])),
    [categories],
  );
  const optionGroupsById = useMemo(
    () => Object.fromEntries(optionGroups.map((group) => [group.id, group])),
    [optionGroups],
  );
  const optionsById = useMemo(() => Object.fromEntries(options.map((option) => [option.id, option])), [options]);

  const itemCountByCategoryId = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.categoryId] = (counts[item.categoryId] ?? 0) + 1;
    }
    return counts;
  }, [items]);

  const usedByCountByGroupId = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      for (const groupId of item.optionGroupIds) {
        counts[groupId] = (counts[groupId] ?? 0) + 1;
      }
    }
    return counts;
  }, [items]);

  function handleSaved() {
    setItemModal(null);
    setCategoryModal(null);
    setGroupModal(null);
    router.refresh();
  }

  const editingGroup = groupModal?.mode === "edit" ? groupModal.group : undefined;
  const editingGroupOptions = editingGroup
    ? editingGroup.optionIds.map((id) => optionsById[id]).filter((option): option is Option => Boolean(option))
    : undefined;

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="font-display text-2xl text-ink">Menu</h1>
        <p className="text-[13px] text-ink-subtle">Manage categories, items, and option groups.</p>
      </div>

      <AdminMenuTabs activeTab={activeTab} onSelect={setActiveTab} />

      {activeTab === "items" && (
        <AdminItemsTable
          items={items}
          categoriesById={categoriesById}
          optionGroupsById={optionGroupsById}
          onEdit={(item) => setItemModal({ mode: "edit", item })}
          onCreateNew={() => setItemModal({ mode: "create" })}
        />
      )}

      {activeTab === "categories" && (
        <AdminCategoriesTable
          categories={categories}
          itemCountByCategoryId={itemCountByCategoryId}
          onEdit={(category) => setCategoryModal({ mode: "edit", category })}
          onCreateNew={() => setCategoryModal({ mode: "create" })}
        />
      )}

      {activeTab === "groups" && (
        <AdminOptionGroupsGrid
          optionGroups={optionGroups}
          optionsById={optionsById}
          usedByCountByGroupId={usedByCountByGroupId}
          onEdit={(group) => setGroupModal({ mode: "edit", group })}
          onCreateNew={() => setGroupModal({ mode: "create" })}
        />
      )}

      {itemModal && (
        <AdminItemForm
          open
          onClose={() => setItemModal(null)}
          onSaved={handleSaved}
          item={itemModal.mode === "edit" ? itemModal.item : undefined}
          categories={categories}
          optionGroups={optionGroups}
        />
      )}

      {categoryModal && (
        <AdminCategoryForm
          open
          onClose={() => setCategoryModal(null)}
          onSaved={handleSaved}
          category={categoryModal.mode === "edit" ? categoryModal.category : undefined}
        />
      )}

      {groupModal && (
        <AdminOptionGroupForm
          open
          onClose={() => setGroupModal(null)}
          onSaved={handleSaved}
          group={editingGroup}
          groupOptions={editingGroupOptions}
        />
      )}
    </div>
  );
}
