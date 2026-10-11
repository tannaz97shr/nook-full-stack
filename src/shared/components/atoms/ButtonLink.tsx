import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonClassName } from "./Button";
import type { ButtonVariant } from "./Button";

export interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
}

/** A navigation link styled as a Button — same variants, same classes. */
export function ButtonLink({ variant = "primary", className = "", ...props }: ButtonLinkProps) {
  return <Link className={buttonClassName(variant, false, className)} {...props} />;
}
