import type { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  variant?: "neutral" | "gold" | "clay";
  title?: string;
  className?: string;
}

const VARIANT_CLASSES: Record<NonNullable<BadgeProps["variant"]>, string> = {
  neutral: "border border-border bg-sunken text-ink-muted",
  gold: "bg-gold-soft text-gold",
  clay: "bg-clay text-bg",
};

export function Badge({ children, variant = "neutral", title, className = "" }: BadgeProps) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-pill px-[9px] py-[3px] font-mono text-[10.5px] font-medium tracking-wide ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
