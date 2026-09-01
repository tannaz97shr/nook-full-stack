export const THEME_STORAGE_KEY = "nook-theme";
export const DARK_CLASS = "dark";

export type ThemePreference = "light" | "dark" | "system";

/**
 * Runs in an inline <script> before first paint (see src/app/layout.tsx and
 * src/app/global-error.tsx) to avoid a flash of the wrong theme. Wrapped in
 * try/catch because localStorage throws in Safari private mode. Contains no
 * user input and no `</script>` sequence, so dangerouslySetInnerHTML is safe.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("${DARK_CLASS}",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
