"use client";

import { useSyncExternalStore } from "react";
import { DARK_CLASS } from "@/shared/utils/theme";

// The <html> class (set by THEME_INIT_SCRIPT, flipped by ThemeToggle) is the one source of truth. Subscribing to it,
// rather than copying it into state on mount, keeps every toggle in sync — AdminShell renders two (sidebar + mobile
// bar), and a per-instance copy went stale when the other one was clicked.
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getSnapshot(): boolean {
  return document.documentElement.classList.contains(DARK_CLASS);
}

// The server can't know the theme; React re-renders with the client snapshot right after hydration.
function getServerSnapshot(): boolean {
  return false;
}

export function useIsDarkTheme(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
