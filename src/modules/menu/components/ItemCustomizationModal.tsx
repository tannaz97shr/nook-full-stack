"use client";

import Image from "next/image";
import { Button, Modal, QuantityStepper } from "@/shared/components";
import { formatMoney } from "@/shared/utils/format-money";
import { addToCartButtonLabel, missingSelectionMessage } from "../content/menuContent";
import { useItemCustomization } from "../hooks/useItemCustomization";
import { isGroupSatisfied } from "../lib/optionGroupValidation";
import type { SelectionsByGroupId } from "../lib/optionGroupValidation";
import type { MenuItem, Option, OptionGroup } from "../types";
import { OptionGroupSection } from "./OptionGroupSection";

export interface ItemCustomizationModalProps {
  item: MenuItem;
  optionGroups: OptionGroup[];
  optionsById: Record<string, Option>;
  open: boolean;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    selections: SelectionsByGroupId,
    quantity: number,
    unitPrice: number,
  ) => void;
}

export function ItemCustomizationModal({
  item,
  optionGroups,
  optionsById,
  open,
  onClose,
  onAddToCart,
}: ItemCustomizationModalProps) {
  const {
    selections,
    quantity,
    toggleOption,
    incrementQuantity,
    decrementQuantity,
    isValid,
    unsatisfiedNames,
    unitTotal,
    total,
    reset,
  } = useItemCustomization({ item, optionGroups, optionsById });

  function handleClose() {
    reset();
    onClose();
  }

  function handleAdd() {
    if (!isValid) return;
    onAddToCart(item, selections, quantity, unitTotal);
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} labelledBy="item-customization-title">
      <div className="overflow-y-auto">
        <div className="relative h-[clamp(140px,22vh,200px)] flex-none bg-sunken">
          {item.images[0] && (
            <Image
              src={item.images[0]}
              alt={item.name}
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-pill bg-surface text-ink shadow-sm"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">
          <h2
            id="item-customization-title"
            className="font-display text-[1.7rem] font-medium text-ink"
          >
            {item.name}
          </h2>
          <p className="mt-1 text-sm text-ink-subtle">{item.description}</p>
          <p className="mt-2 font-mono text-sm text-ink-muted">
            Base {formatMoney(item.basePrice)}
          </p>

          {optionGroups.map((group) => (
            <OptionGroupSection
              key={group.id}
              group={group}
              options={group.optionIds
                .map((id) => optionsById[id])
                .filter((option): option is Option => Boolean(option))}
              selectedIds={selections[group.id] ?? []}
              onToggle={(optionId) => toggleOption(group, optionId)}
              isSatisfied={isGroupSatisfied(group, selections[group.id] ?? [])}
            />
          ))}
        </div>
      </div>

      <div className="flex-none border-t border-border bg-surface px-6 py-4">
        <div className="flex items-center gap-3">
          <QuantityStepper
            value={quantity}
            onIncrement={incrementQuantity}
            onDecrement={decrementQuantity}
            size="md"
          />
          <Button variant="primary" fullWidth disabled={!isValid} onClick={handleAdd}>
            {addToCartButtonLabel(total, isValid)}
          </Button>
        </div>
        {!isValid && (
          <p className="mt-2.5 text-center text-[12.5px] text-clay">
            {missingSelectionMessage(unsatisfiedNames)}
          </p>
        )}
      </div>
    </Modal>
  );
}
