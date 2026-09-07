import { formatMoney } from "@/shared/utils/format-money";
import { NEW_OPTION_GROUP_LABEL, optionGroupMeta, usedByLabel } from "../content/adminMenuContent";
import type { Option, OptionGroup } from "../types";

export interface AdminOptionGroupsGridProps {
  optionGroups: OptionGroup[];
  optionsById: Record<string, Option>;
  usedByCountByGroupId: Record<string, number>;
  onEdit: (group: OptionGroup) => void;
  onCreateNew: () => void;
}

export function AdminOptionGroupsGrid({
  optionGroups,
  optionsById,
  usedByCountByGroupId,
  onEdit,
  onCreateNew,
}: AdminOptionGroupsGridProps) {
  return (
    <div className="grid gap-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCreateNew}
          className="rounded-pill bg-gold px-4 py-2 text-[13.5px] font-bold text-gold-ink hover:bg-gold-hover"
        >
          {NEW_OPTION_GROUP_LABEL}
        </button>
      </div>

      <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr))]">
        {optionGroups.map((group) => {
          const options = group.optionIds.map((id) => optionsById[id]).filter((option): option is Option => Boolean(option));
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => onEdit(group)}
              className="rounded-md border border-border bg-admin-panel p-[17px] text-left hover:bg-admin-row"
            >
              <div className="mb-1 flex items-center justify-between gap-2.5">
                <span className="text-[14.5px] font-bold text-ink">{group.name}</span>
                <span
                  className={`rounded-pill px-[9px] py-[3px] font-mono text-[10.5px] font-medium tracking-wide ${
                    group.isRequired ? "bg-gold-soft text-gold" : "border border-border bg-sunken text-ink-muted"
                  }`}
                >
                  {group.isRequired ? "Required" : "Optional"}
                </span>
              </div>
              <div className="mb-3.5 font-mono text-[10.5px] text-ink-subtle">
                {optionGroupMeta(group.selectionType, options.length)}
              </div>
              <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border">
                {options.map((option) => (
                  <div key={option.id} className="flex justify-between gap-3 bg-admin-panel px-3 py-[9px] text-[13px]">
                    <span className="text-ink">{option.name}</span>
                    <span className="font-mono text-ink-subtle">
                      {option.priceModifier === 0 ? "—" : formatMoney(option.priceModifier)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-ink-subtle">{usedByLabel(usedByCountByGroupId[group.id] ?? 0)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
