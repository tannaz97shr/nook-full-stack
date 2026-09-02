export interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  size?: "sm" | "md";
  decrementLabel?: string;
  incrementLabel?: string;
}

const SIZE_CLASSES: Record<
  NonNullable<QuantityStepperProps["size"]>,
  { button: string; text: string }
> = {
  sm: { button: "h-7 w-7 text-sm", text: "min-w-[22px] text-[13.5px]" },
  md: { button: "h-[34px] w-[34px] text-base", text: "min-w-[26px] text-sm" },
};

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  min = 1,
  size = "md",
  decrementLabel = "Decrease quantity",
  incrementLabel = "Increase quantity",
}: QuantityStepperProps) {
  const sizeClasses = SIZE_CLASSES[size];
  const canDecrement = value > min;

  return (
    <div className="flex items-center gap-0.5 rounded-pill border border-border p-[3px]">
      <button
        type="button"
        onClick={onDecrement}
        disabled={!canDecrement}
        aria-label={decrementLabel}
        className={`grid place-items-center rounded-pill text-ink hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-40 ${sizeClasses.button}`}
      >
        −
      </button>
      <span className={`text-center font-mono ${sizeClasses.text}`}>{value}</span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label={incrementLabel}
        className={`grid place-items-center rounded-pill text-ink hover:bg-sunken ${sizeClasses.button}`}
      >
        +
      </button>
    </div>
  );
}
