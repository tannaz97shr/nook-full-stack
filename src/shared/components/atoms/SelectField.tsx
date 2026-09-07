import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, error, id, name, className = "", children, ...props },
  ref,
) {
  const inputId = id ?? name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <label className="grid gap-[7px]" htmlFor={inputId}>
      <span className="text-[13.5px] font-semibold text-ink-muted">{label}</span>
      <select
        ref={ref}
        id={inputId}
        name={name}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`w-full rounded-md border bg-surface px-4 py-[14px] text-[15px] text-ink ${error ? "border-clay" : "border-border-strong"} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span id={errorId} className="text-xs text-clay">
          {error}
        </span>
      )}
    </label>
  );
});
