import { Badge } from "@/shared/components";
import { ADMIN_CATEGORIES_FOOTNOTE, NEW_CATEGORY_LABEL, categoryVisibilityChip } from "../content/adminMenuContent";
import type { Category } from "../types";

export interface AdminCategoriesTableProps {
  categories: Category[];
  itemCountByCategoryId: Record<string, number>;
  onEdit: (category: Category) => void;
  onCreateNew: () => void;
}

/** No drag-handle reordering this phase — categories append at the end (displayOrder is server-computed). */
export function AdminCategoriesTable({
  categories,
  itemCountByCategoryId,
  onEdit,
  onCreateNew,
}: AdminCategoriesTableProps) {
  return (
    <div className="grid gap-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCreateNew}
          className="rounded-pill bg-gold px-4 py-2 text-[13.5px] font-bold text-gold-ink hover:bg-gold-hover"
        >
          {NEW_CATEGORY_LABEL}
        </button>
      </div>

      <div className="overflow-x-auto rounded-md border border-border bg-admin-panel">
        <div className="grid min-w-[520px] grid-cols-[2fr_1fr_1fr] gap-3.5 border-b border-border bg-admin-row px-[17px] py-[11px] font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-subtle">
          <span>Category</span>
          <span>Items</span>
          <span>Visibility</span>
        </div>
        {categories.map((category) => {
          const itemCount = itemCountByCategoryId[category.id] ?? 0;
          const chip = categoryVisibilityChip(category.isActive, itemCount);
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onEdit(category)}
              className="grid min-w-[520px] w-full grid-cols-[2fr_1fr_1fr] items-center gap-3.5 border-b border-border px-[17px] py-3 text-left last:border-b-0 hover:bg-admin-row"
            >
              <span className="text-[13.5px] font-semibold text-ink">{category.name}</span>
              <span className="font-mono text-[13px] text-ink-muted">{itemCount}</span>
              <span>
                <Badge variant={chip.variant === "leaf" ? "leaf" : chip.variant === "clay" ? "clay" : "neutral"}>
                  {chip.label}
                </Badge>
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-[12.5px] text-ink-subtle">{ADMIN_CATEGORIES_FOOTNOTE}</p>
    </div>
  );
}
