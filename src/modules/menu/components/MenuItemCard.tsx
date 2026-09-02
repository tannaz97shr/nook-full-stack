import Image from "next/image";
import { Button } from "@/shared/components";
import { formatMoney } from "@/shared/utils/format-money";
import {
  CHOOSE_ADD_LABEL,
  FROM_PRICE_PREFIX,
  QUICK_ADD_LABEL,
  SOLD_OUT_LABEL,
  UNAVAILABLE_ADD_LABEL,
} from "../content/menuContent";
import { computeFromPrice } from "../lib/computeFromPrice";
import type { MenuItem, Option, OptionGroup } from "../types";
import { DietaryBadgeList } from "./DietaryBadgeList";

export interface MenuItemCardProps {
  item: MenuItem;
  optionGroupsById: Record<string, OptionGroup>;
  optionsById: Record<string, Option>;
  onAdd: (item: MenuItem) => void;
}

export function MenuItemCard({ item, optionGroupsById, optionsById, onAdd }: MenuItemCardProps) {
  const soldOut = !item.isAvailable;
  const hasOptionGroups = item.optionGroupIds.length > 0;
  const { isFrom, price } = computeFromPrice(item, optionGroupsById, optionsById);
  const addLabel = soldOut
    ? UNAVAILABLE_ADD_LABEL
    : hasOptionGroups
      ? CHOOSE_ADD_LABEL
      : QUICK_ADD_LABEL;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-lg border border-border bg-surface ${soldOut ? "opacity-55" : ""}`}
    >
      <div className="relative aspect-[4/3] bg-sunken">
        {item.images[0] && (
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            sizes="(min-width: 640px) 272px, 100vw"
            className={`object-cover ${soldOut ? "grayscale contrast-[0.92]" : ""}`}
          />
        )}
        {soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-overlay">
            <span className="rounded-pill border border-border-strong bg-surface px-[18px] py-2 text-[13px] font-bold text-clay">
              {SOLD_OUT_LABEL}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 px-[18px] py-4">
        <h3 className="font-display text-xl font-medium leading-tight text-ink">{item.name}</h3>
        <p className="text-[13.5px] leading-relaxed text-ink-subtle">{item.description}</p>
        <DietaryBadgeList tags={item.dietaryTags} />
        <div className="flex-1" />
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="grid">
            {isFrom && <span className="text-[11px] text-ink-subtle">{FROM_PRICE_PREFIX}</span>}
            <span className="font-mono text-base font-medium text-ink">{formatMoney(price)}</span>
          </div>
          <Button variant="secondary" disabled={soldOut} onClick={() => onAdd(item)}>
            {addLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}
