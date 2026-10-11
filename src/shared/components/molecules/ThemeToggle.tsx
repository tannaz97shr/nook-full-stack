"use client";

import { useIsDarkTheme } from "@/shared/hooks/useIsDarkTheme";
import { DARK_CLASS, THEME_STORAGE_KEY } from "@/shared/utils/theme";
import { logError } from "@/shared/utils/log-error";

export function ThemeToggle() {
  // Read from the <html> class, not local state, so every instance on the page
  // (AdminShell renders two) re-renders when any of them flips the theme.
  const isDark = useIsDarkTheme();

  function toggleTheme() {
    const next = !isDark;
    document.documentElement.classList.toggle(DARK_CLASS, next);
    document.documentElement.style.colorScheme = next ? "dark" : "light";
    // Raw string, not JSON — THEME_INIT_SCRIPT reads this key with a plain
    // `=== "dark"` comparison (see theme.ts), so it must match exactly.
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch (error) {
      logError(error, "ThemeToggle:persist", { level: "warn" });
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-9 w-9 place-items-center rounded-pill border border-border text-ink hover:bg-sunken"
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
