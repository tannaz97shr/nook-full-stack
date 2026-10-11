"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusable(panel: HTMLElement): HTMLElement[] {
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

/**
 * Modal-dialog keyboard + scroll behaviour for an overlay panel: Escape
 * closes, focus moves in on open and back to the opener on close, Tab is
 * trapped inside the panel, and the page behind can't scroll.
 *
 * `panelRef` must point at an element with `tabIndex={-1}` so it can take
 * focus itself when it contains nothing focusable.
 *
 * `returnFocusRef`, when given, is where focus goes on close instead of
 * whatever was focused at open time. Pass the opener whenever it's a
 * single known control: a pointer click doesn't focus a button in WebKit
 * (Safari/iOS), so the captured "opener" there is just <body>.
 */
export function useDialogBehavior(
  open: boolean,
  panelRef: RefObject<HTMLElement>,
  onClose: () => void,
  returnFocusRef?: RefObject<HTMLElement>,
) {
  // Kept in a ref so a new onClose identity each render doesn't re-run the
  // open/close effect below (which would bounce focus back to the opener).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const opener =
      returnFocusRef?.current ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    (getFocusable(panel)[0] ?? panel).focus();

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    // Compensate for the scrollbar disappearing so the page doesn't shift
    // sideways on desktop (zero on overlay-scrollbar mobile browsers).
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = getFocusable(panel);
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const outside = !panel.contains(active);

      if (event.shiftKey && (active === first || active === panel || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      if (opener?.isConnected) opener.focus();
    };
  }, [open, panelRef, returnFocusRef]);
}
