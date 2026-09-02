"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
}

/**
 * One component for both "bottom sheet on mobile / centered dialog on
 * desktop" — a single responsive treatment, not two components.
 */
export function Modal({ open, onClose, children, labelledBy }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-fade cursor-default bg-overlay"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative flex max-h-[94vh] w-full animate-pop flex-col overflow-hidden rounded-t-xl bg-surface shadow-xl sm:mb-[5vh] sm:max-h-[88vh] sm:max-w-lg sm:rounded-xl"
      >
        {children}
      </div>
    </div>
  );
}
