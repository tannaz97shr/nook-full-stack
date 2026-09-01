"use client";

// Error boundaries must keep working even when the rest of the app is
// broken, so this renders with token utility classes only — do not import
// other shared components (e.g. a Button atom) into this file.
export interface ErrorStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  digest?: string;
  className?: string;
}

export function ErrorState({
  title,
  description,
  actionLabel,
  onAction,
  digest,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex max-w-md flex-col items-center gap-4 rounded-lg border border-border bg-surface px-8 py-10 text-center shadow-sm ${className}`}
    >
      <h1 className="font-display text-3xl text-ink">{title}</h1>
      <p className="text-base text-ink-muted">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-pill bg-gold px-6 py-3 text-base text-gold-ink hover:bg-gold-hover"
        >
          {actionLabel}
        </button>
      )}
      {digest && (
        <p className="font-mono text-xs text-ink-subtle">{digest}</p>
      )}
    </div>
  );
}
