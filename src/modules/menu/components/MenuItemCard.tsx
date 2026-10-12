import Image from "next/image";
import { Button } from "@/shared/components";
import { formatMoney } from "@/shared/utils/format-money";
import {
  addButtonAccessibleName,
  CHOOSE_ADD_LABEL,
  FROM_PRICE_PREFIX,
  QUICK_ADD_LABEL,
  SOLD_OUT_LABEL,
  UNAVAILABLE_ADD_LABEL,
} from "../content/menuContent";
import type { AddButtonKind } from "../content/menuContent";
import { computeFromPrice } from "../lib/computeFromPrice";
import type { MenuItem, Option, OptionGroup } from "../types";
import { DietaryBadgeList } from "./DietaryBadgeList";

export interface MenuItemCardProps {
  item: MenuItem;
  optionGroupsById: Record<string, OptionGroup>;
  optionsById: Record<string, Option>;
  onAdd: (item: MenuItem) => void;
  /** The add flow isn't ready yet (pre-hydration) — the button renders disabled with a soft pending look. */
  addPending?: boolean;
  /** Preload the photo — set only on the card that's the page's LCP element. */
  priority?: boolean;
}

export function MenuItemCard({
  item,
  optionGroupsById,
  optionsById,
  onAdd,
  addPending = false,
  priority = false,
}: MenuItemCardProps) {
  const soldOut = !item.isAvailable;
  const hasOptionGroups = item.optionGroupIds.length > 0;
  const { isFrom, price } = computeFromPrice(item, optionGroupsById, optionsById);
  const addKind: AddButtonKind = soldOut ? "unavailable" : hasOptionGroups ? "choose" : "quick-add";
  const addLabel = {
    unavailable: UNAVAILABLE_ADD_LABEL,
    choose: CHOOSE_ADD_LABEL,
    "quick-add": QUICK_ADD_LABEL,
  }[addKind];

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-lg border border-border bg-surface ${soldOut ? "opacity-55" : ""}`}
    >
      <div className="relative aspect-[4/3] bg-sunken">
        {item.images[0] && (
          <Image
            src={item.images[0]}
            // Decorative: the item name is the <h3> directly below, so a
            // named alt would make screen readers announce it twice.
            alt=""
            fill
            priority={priority}
            // Cards are minmax(272px, 1fr) columns: ~280px at the 1240px
            // container, up to ~half the viewport in the 2-column range.
            sizes="(min-width: 1240px) 280px, (min-width: 640px) 50vw, 100vw"
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
          <Button
            variant="secondary"
            disabled={soldOut}
            pending={addPending}
            onClick={() => onAdd(item)}
            aria-label={addButtonAccessibleName(addKind, item.name)}
          >
            {addLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}
