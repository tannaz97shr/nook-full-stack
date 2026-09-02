export interface CategoryTabItem {
  id: string;
  name: string;
  count: number;
}

export interface CategoryTabsProps {
  categories: CategoryTabItem[];
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryTabs({ categories, activeCategoryId, onSelect }: CategoryTabsProps) {
  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-bg px-4 py-3 sm:-mx-8 sm:px-8">
      <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
        {categories.map((category) => {
          const active = category.id === activeCategoryId;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={`flex flex-none items-center gap-2 rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-gold text-gold-ink shadow-sm"
                  : "border border-border bg-surface text-ink-muted"
              }`}
            >
              <span>{category.name}</span>
              <span className="font-mono text-[11.5px] opacity-60">{category.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
