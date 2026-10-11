"use client";

import { useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { useDialogBehavior } from "@/shared/hooks/useDialogBehavior";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  /** For the opener's `aria-controls` — only exists while open, so openers set it conditionally. */
  id?: string;
  /** The opener, if it's a single known control — see useDialogBehavior. */
  returnFocusRef?: RefObject<HTMLElement>;
}

export function Drawer({ open, onClose, children, labelledBy, id, returnFocusRef }: DrawerProps) {
  const panelRef = useRef<HTMLElement>(null);
  useDialogBehavior(open, panelRef, onClose, returnFocusRef);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Pointer-only dismiss — keyboard users have Escape and the panel's own close button. */}
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 animate-fade cursor-default bg-overlay"
      />
      <aside
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className="relative flex h-full w-full max-w-[430px] animate-slide-in flex-col border-l border-border bg-bg shadow-xl focus:outline-none"
      >
        {children}
      </aside>
    </div>
  );
}
