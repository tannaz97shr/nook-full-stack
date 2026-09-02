"use client";

import { createContext, useCallback, useState } from "react";
import type { ReactNode } from "react";
import { Toast } from "../molecules/Toast";
import type { ToastProps } from "../molecules/Toast";

interface ToastEntry {
  id: string;
  message: string;
  variant: NonNullable<ToastProps["variant"]>;
}

export interface ToastContextValue {
  showToast: (message: string, variant?: ToastProps["variant"]) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

// Matches the `toast` Tailwind animation's 3s duration (tailwind.config.ts)
// so entries are cleared from state right as they finish fading out.
const TOAST_DURATION_MS = 3000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastProps["variant"] = "info") => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, message, variant }]);
      setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, TOAST_DURATION_MS);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} variant={toast.variant} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
