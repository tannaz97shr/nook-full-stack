import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mirrors design/design-tokens.md 1:1. Values are hex/rgba literals
        // behind CSS vars, so Tailwind's alpha modifier (bg-surface/50) will
        // NOT work here — add parallel RGB-triple vars if that's ever needed.
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        sunken: "var(--color-sunken)",
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          muted: "var(--color-ink-muted)",
          subtle: "var(--color-ink-subtle)",
        },
        gold: {
          DEFAULT: "var(--color-gold)",
          hover: "var(--color-gold-hover)",
          ink: "var(--color-gold-ink)",
          soft: "var(--color-gold-soft)",
        },
        leaf: "var(--color-leaf)",
        clay: "var(--color-clay)",
        overlay: "var(--color-overlay)",
        admin: {
          bg: "var(--color-admin-bg)",
          panel: "var(--color-admin-panel)",
          row: "var(--color-admin-row)",
        },
      },
      fontFamily: {
        // Fallbacks live INSIDE var() on purpose: if the var is ever
        // undefined (e.g. global-error.tsx, which skips the next/font
        // loaders), `var(--x), a, b` drops the whole declaration at
        // computed-value time, while `var(--x, a, b)` degrades correctly.
        display: 'var(--font-display, Georgia, "Times New Roman", serif)',
        sans: 'var(--font-sans, "Helvetica Neue", Helvetica, Arial, sans-serif)',
        mono: "var(--font-mono, ui-monospace, Menlo, monospace)",
      },
      fontSize: {
        display: [
          "clamp(2rem,4.4vw,3.1rem)",
          { lineHeight: "1.05", letterSpacing: "-0.025em" },
        ],
        "4xl": ["2.4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "3xl": ["1.9rem", { lineHeight: "1.2" }],
        "2xl": ["1.5rem", { lineHeight: "1.25" }],
        lg: ["1.125rem", { lineHeight: "1.6" }],
        base: ["1rem", { lineHeight: "1.6" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        xs: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        pop: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        toast: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "10%": { opacity: "1", transform: "translateY(0)" },
          "90%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        fade: "fade 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        pop: "pop 0.2s ease-out",
        toast: "toast 3s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
