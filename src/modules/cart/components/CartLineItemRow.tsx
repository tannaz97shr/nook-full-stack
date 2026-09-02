import Image from "next/image";
import { QuantityStepper } from "@/shared/components";
import { formatMoney } from "@/shared/utils/format-money";
import { REMOVE_LABEL } from "../content/cartContent";
import type { CartLineItem } from "../types";

export interface CartLineItemRowProps {
  line: CartLineItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartLineItemRow({ line, onIncrement, onDecrement, onRemove }: CartLineItemRowProps) {
  const optionsSummary = line.selections
    .flatMap((group) => group.options.map((option) => option.name))
    .join(" · ");
  const lineTotal = line.unitPrice * line.quantity;

  return (
    <div className="flex gap-3.5 border-b border-border py-[18px]">
      <div className="relative h-[66px] w-[66px] flex-none overflow-hidden rounded-md bg-sunken">
        {line.image && (
          <Image src={line.image} alt={line.name} fill sizes="66px" className="object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2.5">
          <div className="text-[15px] font-semibold leading-tight text-ink">{line.name}</div>
          <div className="font-mono text-sm text-ink">{formatMoney(lineTotal)}</div>
        </div>
        {optionsSummary && (
          <div className="mt-0.5 text-[12.5px] leading-snug text-ink-subtle">{optionsSummary}</div>
        )}
        <div className="mt-[11px] flex items-center justify-between gap-2.5">
          <QuantityStepper
            value={line.quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            size="sm"
            min={0}
          />
          <button
            type="button"
            onClick={onRemove}
            className="text-[12.5px] text-ink-subtle underline decoration-1 underline-offset-[3px] hover:text-clay"
          >
            {REMOVE_LABEL}
          </button>
        </div>
      </div>
    </div>
  );
}
