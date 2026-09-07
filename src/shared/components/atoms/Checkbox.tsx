import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, id, name, className = "", ...props },
  ref,
) {
  const inputId = id ?? name;

  return (
    <label
      htmlFor={inputId}
      className={`flex items-center gap-[10px] text-[14px] font-medium text-ink ${className}`}
    >
      <input
        ref={ref}
        id={inputId}
        name={name}
        type="checkbox"
        className="h-[18px] w-[18px] rounded-sm border-border-strong accent-gold"
        {...props}
      />
      {label}
    </label>
  );
});
