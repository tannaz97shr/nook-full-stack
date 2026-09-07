export interface CheckboxGroupOption {
  value: string;
  label: string;
}

export interface CheckboxGroupProps {
  label: string;
  options: CheckboxGroupOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

/** Labeled multi-select pill list — used for dietaryTags and optionGroupIds. */
export function CheckboxGroup({ label, options, selected, onChange }: CheckboxGroupProps) {
  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }

  return (
    <div className="grid gap-[9px]">
      <span className="text-[13.5px] font-semibold text-ink-muted">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isChecked = selected.includes(option.value);
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-pill border px-3 py-[7px] text-[13px] font-medium ${
                isChecked ? "border-gold bg-gold-soft text-gold" : "border-border-strong text-ink-muted"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isChecked}
                onChange={() => toggle(option.value)}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}
