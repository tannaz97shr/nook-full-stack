import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "on-photo";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  icon?: ReactNode;
  /**
   * Not interactive *yet* (e.g. before hydration) — disabled like `disabled`,
   * but styled far more softly, since it usually clears within a fraction of
   * a second and shouldn't flash a "can't use this" look. A real `disabled`
   * still wins when both are set.
   */
  pending?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-gold-ink shadow-md hover:bg-gold-hover px-6 py-4 text-base font-bold",
  secondary:
    "border border-border-strong bg-surface text-ink hover:bg-sunken px-6 py-[14px] text-[15px] font-semibold",
  // Theme-invariant: for controls sitting on a photo behind a dark scrim.
  "on-photo": "bg-on-photo text-on-photo-ink hover:opacity-90 px-6 py-4 text-base font-bold",
};

/** Shared by Button and ButtonLink so a link-styled CTA can't drift from a real button. */
const DISABLED_CLASSES =
  "disabled:cursor-not-allowed disabled:opacity-40 disabled:grayscale disabled:shadow-none";
const PENDING_CLASSES = "disabled:cursor-wait disabled:opacity-80";

export function buttonClassName(
  variant: ButtonVariant,
  fullWidth = false,
  className = "",
  pending = false,
): string {
  return `inline-flex items-center justify-center gap-[11px] rounded-pill transition-colors ${pending ? PENDING_CLASSES : DISABLED_CLASSES} ${VARIANT_CLASSES[variant]} ${fullWidth ? "w-full" : ""} ${className}`;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", fullWidth = false, icon, className = "", pending = false, disabled, children, ...props },
  ref,
) {
  const isPendingOnly = pending && !disabled;
  return (
    <button
      ref={ref}
      className={buttonClassName(variant, fullWidth, className, isPendingOnly)}
      disabled={disabled || pending}
      aria-busy={isPendingOnly || undefined}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
});
