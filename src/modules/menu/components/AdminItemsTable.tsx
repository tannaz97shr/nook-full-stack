"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge, Switch } from "@/shared/components";
import { useToast } from "@/shared/hooks/useToast";
import { DEMO_READ_ONLY_MESSAGE } from "@/shared/content/demo-content";
import { isDemoReadOnlyError } from "@/shared/utils/demo-read-only";
import { formatMoney } from "@/shared/utils/format-money";
import { useMenuItemAvailabilityToggle } from "../hooks/useMenuItemAvailabilityToggle";
import {
  ADMIN_ITEMS_FOOTNOTE,
  AVAILABILITY_STATE_LABELS,
  AVAILABILITY_TOGGLE_ERROR,
  FEATURED_CHIP_LABEL,
  NEW_ITEM_LABEL,
  availabilitySwitchLabel,
} from "../content/adminMenuContent";
import type { Category, MenuItem, OptionGroup } from "../types";

export interface AdminItemsTableProps {
  items: MenuItem[];
  categoriesById: Record<string, Category>;
  optionGroupsById: Record<string, OptionGroup>;
  onEdit: (item: MenuItem) => void;
  onCreateNew: () => void;
}

/** The 86-toggle: optimistic local flip with rollback+toast on error, independent of the RSC-fetched items prop. */
export function AdminItemsTable({
  items,
  categoriesById,
  optionGroupsById,
  onEdit,
  onCreateNew,
}: AdminItemsTableProps) {
  const [localItems, setLocalItems] = useState(items);
  const { showToast } = useToast();
  const toggle = useMenuItemAvailabilityToggle();

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  function handleToggle(item: MenuItem) {
    const nextAvailable = !item.isAvailable;
    setLocalItems((current) =>
      current.map((existing) =>
        existing.id === item.id ? { ...existing, isAvailable: nextAvailable } : existing,
      ),
    );
    toggle.mutate(
      { itemId: item.id, isAvailable: nextAvailable },
      {
        onError: (error) => {
          setLocalItems((current) =>
            current.map((existing) =>
              existing.id === item.id ? { ...existing, isAvailable: item.isAvailable } : existing,
            ),
          );
          showToast(isDemoReadOnlyError(error) ? DEMO_READ_ONLY_MESSAGE : AVAILABILITY_TOGGLE_ERROR, "error");
        },
      },
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCreateNew}
          className="rounded-pill bg-gold px-4 py-2 text-[13.5px] font-bold text-gold-ink hover:bg-gold-hover"
        >
          {NEW_ITEM_LABEL}
        </button>
      </div>

      <div className="overflow-x-auto rounded-md border border-border bg-admin-panel">
        <div className="grid min-w-[720px] grid-cols-[2fr_1fr_0.8fr_1.4fr_1fr] gap-3.5 border-b border-border bg-admin-row px-[17px] py-[11px] font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-subtle">
          <span>Item</span>
          <span>Category</span>
          <span>Price</span>
          <span>Options</span>
          <span>Available</span>
        </div>
        {localItems.map((item) => {
          const groupsSummary =
            item.optionGroupIds
              .map((id) => optionGroupsById[id]?.name)
              .filter(Boolean)
              .join(", ") || "—";
          return (
            <div
              key={item.id}
              className="grid min-w-[720px] grid-cols-[2fr_1fr_0.8fr_1.4fr_1fr] items-center gap-3.5 border-b border-border px-[17px] py-3 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="flex min-w-0 items-center gap-[11px] text-left"
              >
                <span className="block h-[34px] w-[34px] shrink-0 overflow-hidden rounded-sm bg-sunken">
                  {item.images[0] && (
                    <Image
                      src={item.images[0]}
                      alt=""
                      width={34}
                      height={34}
                      className="h-full w-full object-cover"
                    />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-[13.5px] font-semibold text-ink">{item.name}</span>
                    {item.isFeatured && <Badge variant="gold">{FEATURED_CHIP_LABEL}</Badge>}
                  </span>
                  <span className="block font-mono text-[10.5px] text-ink-subtle">{item.id}</span>
                </span>
              </button>
              <span className="text-[13px] text-ink-muted">{categoriesById[item.categoryId]?.name ?? "—"}</span>
              <span className="font-mono text-[13px] text-ink">{formatMoney(item.basePrice)}</span>
              <span className="text-[12.5px] leading-snug text-ink-subtle">{groupsSummary}</span>
              <Switch
                checked={item.isAvailable}
                onCheckedChange={() => handleToggle(item)}
                aria-label={availabilitySwitchLabel(item.name)}
                stateLabel={item.isAvailable ? AVAILABILITY_STATE_LABELS.on : AVAILABILITY_STATE_LABELS.off}
              />
            </div>
          );
        })}
      </div>
      <p className="text-[12.5px] text-ink-subtle">{ADMIN_ITEMS_FOOTNOTE}</p>
    </div>
  );
}
