export interface ToastProps {
  message: string;
  variant?: "info" | "error";
}

const VARIANT_CLASSES: Record<NonNullable<ToastProps["variant"]>, string> = {
  info: "border-border bg-surface text-ink",
  error: "border-clay bg-surface text-clay",
};

export function Toast({ message, variant = "info" }: ToastProps) {
  return (
    <div
      role="status"
      className={`animate-toast rounded-lg border px-4 py-3 text-sm shadow-md ${VARIANT_CLASSES[variant]}`}
    >
      {message}
    </div>
  );
}
