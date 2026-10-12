export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  /** Names the control for screen readers, e.g. which item it toggles. */
  "aria-label": string;
  /** Visible text beside the track describing the current state, e.g. "Available". */
  stateLabel: string;
}

/**
 * On/off switch for admin tables. The knob is anchored with an explicit
 * left offset: without one, an absolutely positioned child of a <button>
 * starts from the button's centered content box, which pushed the knob
 * past the track and over the state label.
 */
export function Switch({ checked, onCheckedChange, "aria-label": ariaLabel, stateLabel }: SwitchProps) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        onClick={() => onCheckedChange(!checked)}
        className={`relative h-6 w-[42px] shrink-0 rounded-pill transition-colors motion-reduce:transition-none ${
          checked ? "bg-leaf" : "bg-border-strong"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-pill bg-surface shadow-sm transition-transform motion-reduce:transition-none ${
            checked ? "translate-x-[18px]" : "translate-x-0"
          }`}
        />
      </button>
      <span className="text-[12px] font-semibold text-ink-muted">{stateLabel}</span>
    </div>
  );
}
