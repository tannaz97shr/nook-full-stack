"use client";

import { useEffect, useState } from "react";
import { DARK_CLASS, THEME_STORAGE_KEY } from "@/shared/utils/theme";
import { logError } from "@/shared/utils/log-error";

export function ThemeToggle() {
  // THEME_INIT_SCRIPT already set the class before hydration — read it back
  // rather than defaulting to light, so the icon matches on first paint.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains(DARK_CLASS));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
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
