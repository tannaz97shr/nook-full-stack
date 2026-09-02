# Known Issues

Open items tracked per CLAUDE.md § Known open items: undeployed infra
steps, deferred features, investigated-but-unreproduced bugs, un-applied
migration scripts, known UX gaps.

## Open

**ESLint config doesn't fully match CLAUDE.md's stated convention.**
Area: linting. Issue: CLAUDE.md says "core-web-vitals + typescript," but
this Next 14.2.4 / `eslint-config-next` setup has no `next/typescript`
config (that's a Next 15 addition) and `@typescript-eslint/eslint-plugin`
isn't installed (only `@typescript-eslint/parser`, transitively). Impact:
TypeScript-specific lint rules aren't enforced yet. Action: add
`@typescript-eslint/eslint-plugin` (requires a dependency install — ask
first) if/when TS-specific lint rules are needed. Status: open.

**Tailwind is on v3, design tokens sample assumes v4.**
Area: build config. Issue: `design/Nook-standalone-src.dc.html`'s
copy-paste token sample uses Tailwind v4's CSS `@theme` syntax, but this
repo runs Tailwind v3.4.1 with a classic `tailwind.config.ts`. Impact:
none currently — tokens are wired via CSS variables + `theme.extend`,
which is the correct v3 pattern. Action: revisit only if a v4-only
feature is actually needed. Status: open, informational.

**Marketing images are AI-generated placeholders, not real cafe photography.**
Area: assets. Issue: `public/images/marketing/` (hero-latte-art.jpg,
interior-warm.jpg, storefront-exterior.jpg, coffee-closeup.jpg,
table-outdoor.jpg, pastry-closeup.jpg) were generated via ChatGPT to
replace the earlier Pinterest-sourced set (see Resolved, below). They are
a small, deliberately reusable set (6 images covering hero/interior/
exterior/drink/food/outdoor) rather than one photo per menu item — fine
for development, screenshots, and an initial soft-launch, but should be
disclosed as AI-generated (not real photography of an actual location) if
this project comes up in a portfolio/client conversation. Action: swap in
real cafe photography once available, and/or generate per-item menu
photos before a proper public launch. Status: open, non-blocking for
continued development.

**Menu item photos still need a real storage decision.**
Area: architecture. Issue: the 6 marketing images above live in `public/`
(static, bundled at build time) because they're fixed design assets, not
admin-editable data. Actual per-`MenuItem` photos (added/replaced by an
admin) are a different case and should go through Firebase Storage with
token-gated download URLs, per CLAUDE.md's Images convention — this
hasn't been built yet since the data layer doesn't exist until Phase 2.
Action: build the Storage upload/serve pipeline as part of the admin menu
management feature. Status: open, scheduled for a later phase.

**Phase 3 debug routes need deletion once real protected routes exist.**
Area: auth. Issue: `src/app/api/debug/session-check/route.ts` and
`src/app/api/debug/admin-check/route.ts` were added purely to exercise
`requireSession()`/`requireAdminSession()` live, since Phase 3 built the
guards but no real protected API route exists yet to test them against.
Each file's own header comment says to delete it once one does, but that
wasn't tracked anywhere outside code comments. Impact: none currently —
they're QA-only, gated by the same guards as any real route — but they're
dead weight once Phase 5 (`/account/*`) and Phase 6 (`/admin/*`) build
real guarded API routes to exercise instead. Action: delete both files
(and their directories) once Phase 5/6 land. Status: open, scheduled for
Phase 5/6 cleanup.

## Resolved

**Placeholder imagery was Pinterest-sourced.** ~~`assets/img` and
`assets/img-web` contained images collected from Pinterest during design
and were unlicensed.~~ Resolved 2026-09-01: those folders were deleted and
replaced with the 6 AI-generated images now in `public/images/marketing/`
(see the new open item above for their own caveats).
