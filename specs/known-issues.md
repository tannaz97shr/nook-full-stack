# Known Issues

Open items tracked per CLAUDE.md § Known open items: undeployed infra
steps, deferred features, investigated-but-unreproduced bugs, un-applied
migration scripts, known UX gaps.

## Open

**Placeholder imagery is Pinterest-sourced.**
Area: assets. Issue: `assets/img` and `assets/img-web` contain images
collected from Pinterest during design and are unlicensed. Impact: fine
for local development and screenshots, but must not ship as-is. Action:
replace with licensed stock or AI-generated imagery. Status: open —
blocks any public deploy.

**Tailwind is on v3, design tokens sample assumes v4.**
Area: build config. Issue: `design/Nook-standalone-src.dc.html`'s
copy-paste token sample uses Tailwind v4's CSS `@theme` syntax, but this
repo runs Tailwind v3.4.1 with a classic `tailwind.config.ts`. Impact:
none currently — tokens are wired via CSS variables + `theme.extend`,
which is the correct v3 pattern. Action: revisit only if a v4-only
feature is actually needed. Status: open, informational.

**ESLint config doesn't fully match CLAUDE.md's stated convention.**
Area: linting. Issue: CLAUDE.md says "core-web-vitals + typescript," but
this Next 14.2.4 / `eslint-config-next` setup has no `next/typescript`
config (that's a Next 15 addition) and `@typescript-eslint/eslint-plugin`
isn't installed (only `@typescript-eslint/parser`, transitively). Impact:
TypeScript-specific lint rules aren't enforced yet. Action: add
`@typescript-eslint/eslint-plugin` (requires a dependency install — ask
first) if/when TS-specific lint rules are needed. Status: open.

## Resolved
