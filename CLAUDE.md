# CLAUDE.md — Working in the Nook Repo

This file describes **how** to work in this codebase: stack, conventions,
permissions, and security rules. It evolves as the codebase does.

For **what** Nook is (product spec, roles, data model, MVP scope), see
`specs/nook-project-spec.md`. Don't restate product requirements here —
point to the spec instead.

For design tokens and visual reference, see `design/` (token values,
exported reference screens from Claude Design).

## Stack

- Runtime/package manager: **Bun**
- Framework: **Next.js** (App Router)
- Data fetching: **Axios + TanStack Query** — all data fetching goes through this
- Auth: **Auth.js v5 (beta)** (`next-auth`) — credentials + Google providers
- Backend/data: **Firebase Admin SDK** — Firestore + Storage (Blaze plan),
  server-side only, never in Client Components, never `NEXT_PUBLIC_*`
- Payments: **Stripe** — Checkout Sessions + webhooks, test mode, real
  integration (not mocked)
- Forms/validation: **React Hook Form + Zod**
- Linting: ESLint (`eslint-config-next`, core-web-vitals + typescript)
- QA: **Playwright**, run live during development — not a committed test suite

## Code style & structure

- Fully typed TypeScript; split into separate files where sensible.
- Design tokens via CSS variables + Tailwind `@theme` block — **no hardcoded
  colors in components**, every color comes from a variable. See `design/`
  for the token source of truth.
- Light and dark mode supported everywhere.
- Minimum Tailwind classes at the component level — most elements come from
  `src/shared/components/...`, fully styled per the design system.
- **Module convention** (load-bearing): every feature lives under
  `src/modules/<feature>/` with an `api/content/components/hooks/lib/types` split.
- Shared, reusable UI lives in `src/shared/components`
  (atoms → molecules → organisms → templates), plus `src/shared/utils` and
  `src/shared/hooks`.
- UI copy is externalized into per-module content files from the first
  component — never hardcode inline text speculatively "for now."
- Single source of truth for routes/API paths: `src/shared/routes.ts` /
  `api-routes.ts`. No hardcoded path strings elsewhere. Any compound route
  (e.g. sign-in with callback param) gets a helper, not a hand-built string.
- Root-level error boundaries (`error.tsx` + `global-error.tsx`) are part of
  the app shell, not a later add-on.

## Architectural decisions carried into this project

(Full detail in the general playbook knowledge; summarized here for repo use.)

- **Authorization:** `requireAdminSession()` and `requireSession()` are
  checked independently at the top of every relevant API route — never
  rely on a page-level layout gate alone. `proxy.ts` (Next's renamed
  middleware) uses its own lightweight, provider-less NextAuth instance;
  its matcher excludes `/api`, so API routes must self-check.
- **Firestore:** explicit field-mapping via mapper functions
  (`toProduct.ts`-style) — never spread `doc.data()` directly into a
  response. Natural slugs are the doc ID where one exists. Use
  `runTransaction` for read-then-write atomic operations.
- **Cart:** client-side only (`localStorage`, keyed per user) — no Firestore
  cart collection at MVP. Server always re-fetches live price/stock at
  checkout; never trusts client-submitted prices. Cart clears only on
  confirmed `Paid` status.
- **Checkout/Stripe:** server-only Checkout Session creation (`{ url }`
  returned, plain redirect, no Stripe.js/publishable key needed client-side
  for this flow). Use `constructEventAsync` for webhook verification under
  Bun. Idempotency via `processedStripeEventIds` on each order.
- **OptionGroups are reusable standalone entities**, not nested inside
  MenuItem — e.g. "Milk Type" defined once, referenced by every item that
  uses it. (Same pattern as the Tulips project's bouquet components.)
- **Images:** Firebase Storage with token-gated download URLs, not signed
  URLs or `makePublic()`. Server-side magic-byte validation of uploads.
- **Error handling:** `logError(error, context, { level: "error" | "warn" })`
  wrapper. Every `catch` block logs AND sets visible UI state — no bare
  `catch {}`. Every form's `handleSubmit` has an `onInvalid` handler.

## Permissions

- Default: **Manual mode** (review every edit).
- **Plan mode** for architecture, security-relevant, or ambiguous decisions.
- **Auto mode** only for already-approved, low-risk, greenfield batches
  within a session — never for secrets, payments, or auth logic.
- Auto-allowed: `git status`, `bun run lint`, `git commit`.
- Requires asking first: anything changing dependencies, pushing to a remote.
- Hard-denied (never, regardless of mode): `rm -rf`, force-push, reading
  `.env*` or credential files.
- The user runs all git operations themselves (add, commit, push, merge) —
  Claude Code provides exact commands to paste. Exception: concluding a git
  operation already mid-progress.
- Real secrets are never pasted into chat or written by Claude Code.

## Verification

- No committed automated test suite. Verification is live: ad hoc
  Playwright scripts per feature, run against a real local dev/build
  server, screenshots inspected directly, then deleted.
- Security-critical flows (auth, permissions, payments): test **every**
  branch, not just the happy path — e.g. "customer blocked from admin" AND
  "admin allowed into admin," never just one direction.
- An independent Claude-in-Chrome QA pass follows every major feature
  phase, as a fresh-eyes second check after Claude Code's own verification.
- `git stash -u` is the standard way to confirm whether a build/lint issue
  is pre-existing vs. newly introduced.

## Session hygiene

- New Claude Code sessions start at phase/task boundaries — explicitly
  flagged, not just mentioned in passing.
- Plan mode / research-and-propose before writing code on anything
  non-trivial — read real files fresh, don't assume from memory.
- `specs/*.md` are read-only source-of-truth — only edited when the user
  explicitly asks to change a spec.

## Known open items

Track in `specs/known-issues.md`: undeployed infra steps, deferred
features, investigated-but-unreproduced bugs, un-applied migration
scripts, known UX gaps.
