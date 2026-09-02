import { formatMoney } from "@/shared/utils/format-money";

export interface OptionRowProps {
  name: string;
  priceModifier: number;
  selected: boolean;
  onSelect: () => void;
  /** Only changes the mark shape (circle vs rounded square) and a11y role — click semantics are the same button either way, the parent decides replace-vs-toggle. */
  mode: "single" | "multiple";
  disabled?: boolean;
}

export function OptionRow({
  name,
  priceModifier,
  selected,
  onSelect,
  mode,
  disabled = false,
}: OptionRowProps) {
  const markShape = mode === "single" ? "rounded-pill" : "rounded-[5px]";
  const dotShape = mode === "single" ? "rounded-pill" : "rounded-[2px]";

  return (
    <button
      type="button"
      role={mode === "single" ? "radio" : "checkbox"}
      aria-checked={selected}
      onClick={onSelect}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-md border px-[15px] py-[13px] text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        selected ? "border-gold bg-gold-soft" : "border-border bg-surface hover:bg-sunken"
      }`}
    >
      <span
        className={`grid h-[19px] w-[19px] flex-none place-items-center border-[1.5px] ${markShape} ${
          selected ? "border-gold" : "border-border-strong"
        }`}
      >
        {selected && <span className={`h-[9px] w-[9px] bg-gold ${dotShape}`} />}
      </span>
      <span className="flex-1 text-[15px] font-medium text-ink">{name}</span>
      <span className="font-mono text-[13px] text-ink-subtle">
        {priceModifier > 0 ? `+${formatMoney(priceModifier)}` : "—"}
      </span>
    </button>
  );
}
