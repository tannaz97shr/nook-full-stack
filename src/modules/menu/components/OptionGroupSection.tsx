import { Badge } from "@/shared/components";
import {
  MODAL_SELECTION_HINTS,
  OPTIONAL_TAG_LABEL,
  REQUIRED_TAG_LABEL,
} from "../content/menuContent";
import type { Option, OptionGroup } from "../types";
import { OptionRow } from "./OptionRow";

export interface OptionGroupSectionProps {
  group: OptionGroup;
  options: Option[];
  selectedIds: string[];
  onToggle: (optionId: string) => void;
  isSatisfied: boolean;
}

export function OptionGroupSection({
  group,
  options,
  selectedIds,
  onToggle,
  isSatisfied,
}: OptionGroupSectionProps) {
  const tagVariant = !group.isRequired ? "neutral" : isSatisfied ? "gold" : "clay";

  return (
    <section className="mt-6 border-t border-border pt-5">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-medium text-ink">{group.name}</h3>
        <Badge variant={tagVariant}>
          {group.isRequired ? REQUIRED_TAG_LABEL : OPTIONAL_TAG_LABEL}
        </Badge>
      </div>
      <p className="mb-3 text-xs text-ink-subtle">{MODAL_SELECTION_HINTS[group.selectionType]}</p>
      <div className="grid gap-2">
        {options.map((option) => (
          <OptionRow
            key={option.id}
            name={option.name}
            priceModifier={option.priceModifier}
            selected={selectedIds.includes(option.id)}
            onSelect={() => onToggle(option.id)}
            mode={group.selectionType === "single" ? "single" : "multiple"}
            disabled={!option.isAvailable}
          />
        ))}
      </div>
    </section>
  );
}
