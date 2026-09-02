import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  icon?: ReactNode;
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gold text-gold-ink shadow-md hover:bg-gold-hover px-6 py-4 text-base font-bold",
  secondary:
    "border border-border-strong bg-surface text-ink hover:bg-sunken px-6 py-[14px] text-[15px] font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", fullWidth = false, icon, className = "", children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-[11px] rounded-pill transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:grayscale disabled:shadow-none ${VARIANT_CLASSES[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
});
