import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, id, name, className = "", ...props },
  ref,
) {
  const inputId = id ?? name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <label className="grid gap-[7px]" htmlFor={inputId}>
      <span className="text-[13.5px] font-semibold text-ink-muted">{label}</span>
      <input
        ref={ref}
        id={inputId}
        name={name}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`w-full rounded-md border bg-surface px-4 py-[14px] text-[15px] text-ink placeholder:text-ink-subtle ${error ? "border-clay" : "border-border-strong"} ${className}`}
        {...props}
      />
      {error && (
        <span id={errorId} className="text-xs text-clay">
          {error}
        </span>
      )}
    </label>
  );
});
