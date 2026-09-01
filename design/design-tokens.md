# Nook — Design Tokens

Extracted from `design/Nook-standalone-src.dc.html` (Claude Design export,
2026-09-01). Source of truth until superseded by an updated export.

**Note:** the source file gates dark mode with `[data-theme="dark"]` on
some ancestor element. Your project convention (`code-and-technical-decisions.md`)
uses a `.dark` class on `<html>`, toggled via an inline bootstrap script.
Decide explicitly whether to adopt `[data-theme="dark"]` or translate to
`.dark` when implementing — don't let this drift silently.

## Colors — Light (`:root`)

| Token | Value |
|---|---|
| `--color-bg` | `#FBF7F0` |
| `--color-surface` | `#FFFCF6` |
| `--color-sunken` | `#F3EADB` |
| `--color-border` | `#E7DBC9` |
| `--color-border-strong` | `#D6C4AC` |
| `--color-ink` | `#2A1D14` |
| `--color-ink-muted` | `#594636` |
| `--color-ink-subtle` | `#8A7563` |
| `--color-gold` | `#B07C35` |
| `--color-gold-hover` | `#96682A` |
| `--color-gold-ink` | `#FFF9EE` |
| `--color-gold-soft` | `#F6E8CF` |
| `--color-leaf` | `#5B7A4E` |
| `--color-clay` | `#A6462C` |
| `--color-overlay` | `rgba(42,29,20,.42)` |
| `--color-admin-bg` | `#F4EFE6` |
| `--color-admin-panel` | `#FFFDF8` |
| `--color-admin-row` | `#FAF5EC` |

## Colors — Dark (`[data-theme="dark"]`)

| Token | Value |
|---|---|
| `--color-bg` | `#161210` |
| `--color-surface` | `#201A16` |
| `--color-sunken` | `#2A221C` |
| `--color-border` | `#382D25` |
| `--color-border-strong` | `#4C3D31` |
| `--color-ink` | `#F4ECE1` |
| `--color-ink-muted` | `#D3C3B2` |
| `--color-ink-subtle` | `#A08D7B` |
| `--color-gold` | `#DDA857` |
| `--color-gold-hover` | `#EBBB6E` |
| `--color-gold-ink` | `#241804` |
| `--color-gold-soft` | `#36281A` |
| `--color-leaf` | `#8FAE7F` |
| `--color-clay` | `#D9765A` |
| `--color-overlay` | `rgba(8,5,3,.62)` |
| `--color-admin-bg` | `#131010` |
| `--color-admin-panel` | `#1D1815` |
| `--color-admin-row` | `#241E19` |

## Fonts

| Token | Value | Notes |
|---|---|---|
| `--font-display` | `"Newsreader", Georgia, "Times New Roman", serif` | Headings |
| `--font-sans` | `"Karla", "Helvetica Neue", Helvetica, Arial, sans-serif` | Body/UI |
| `--font-mono` | `"IBM Plex Mono", ui-monospace, Menlo, monospace` | Prices, labels (e.g. "From $4.80", "Choose one · required") |

Google Fonts import used in the source:
```
Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..600
Karla:ital,wght@0,300..700;1,400..600
IBM+Plex+Mono:wght@400;500
```

## Type Scale

| Token | Spec | Notes |
|---|---|---|
| `--text-display` | Newsreader 500, `clamp(2rem,4.4vw,3.1rem)`, letter-spacing -.025em, line-height 1.05 | e.g. "A quiet corner" |
| `--text-4xl` | Newsreader 500, 2.4rem (38px), letter-spacing -.02em, line-height 1.1 | e.g. "Menu" |
| `--text-3xl` | Newsreader 500, 1.9rem (30px), line-height 1.2 | e.g. "Popular this week" |
| `--text-2xl` | Newsreader 500, 1.5rem (24px) | e.g. "Flat White" |
| `--text-lg` | Karla 400, 1.125rem (18px), line-height 1.6, color `--color-ink-muted` | body/descriptions |
| `--text-base` | Karla 400, 1rem (16px), line-height 1.6 | default body |
| `--text-sm` | Karla 500, .875rem (14px), color `--color-ink-subtle` | e.g. "Choose one · required" |
| `--text-xs` | IBM Plex Mono 400, .75rem (12px), letter-spacing .08em, uppercase, color `--color-ink-subtle` | e.g. "From $4.80" |

Headings in the actual markup use fluid `clamp()` sizes per-screen rather
than fixed values (e.g. hero `h1` ranges `clamp(2.6rem,6.4vw,4.3rem)`) —
treat the table above as the canonical scale, and note that hero-specific
oversized headings are a deliberate exception, not a new token.

## Spacing

4px base unit: `1, 2, 3, 4, 6, 8, 12, 16, 24` → `4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px`

## Radii

| Token | Value |
|---|---|
| `--radius-sm` | 8px |
| `--radius-md` | 12px |
| `--radius-lg` | 18px |
| `--radius-xl` | 28px |
| `--radius-2xl` | 40px |
| `--radius-pill` | 999px |

## Shadows

Light mode:
```
--shadow-xs: 0 1px 2px rgba(42,29,20,.06)
--shadow-sm: 0 2px 6px rgba(42,29,20,.07)
--shadow-md: 0 8px 20px -6px rgba(42,29,20,.14)
--shadow-lg: 0 20px 44px -14px rgba(42,29,20,.22)
--shadow-xl: 0 36px 76px -24px rgba(42,29,20,.30)
```

Dark mode (same offsets, black-based, higher opacity):
```
--shadow-xs: 0 1px 2px rgba(0,0,0,.35)
--shadow-sm: 0 2px 6px rgba(0,0,0,.4)
--shadow-md: 0 8px 20px -6px rgba(0,0,0,.5)
--shadow-lg: 0 20px 44px -14px rgba(0,0,0,.6)
--shadow-xl: 0 36px 76px -24px rgba(0,0,0,.7)
```

## Base element resets (from source)

- `*{box-sizing:border-box}`
- Body: `background:var(--color-bg); color:var(--color-ink); font-family:var(--font-sans); font-size:16px; line-height:1.55`
- Links: `color:var(--color-gold)`, hover → `var(--color-gold-hover)` with underline
- Selection highlight: `background:var(--color-gold-soft)`
- Named keyframes present in source, reusable as animation tokens: `nkFadeUp`, `nkFade`, `nkSlideIn`, `nkPop`, `nkToast` (used for toast notifications, modal pop-in, drawer slide-in)
