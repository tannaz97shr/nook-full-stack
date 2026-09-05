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

**Phase 3/5b debug routes need deletion once real protected routes exist.**
Area: auth, loyalty. Issue: `src/app/api/debug/session-check/route.ts` and
`src/app/api/debug/admin-check/route.ts` were added purely to exercise
`requireSession()`/`requireAdminSession()` live, since Phase 3 built the
guards but no real protected API route exists yet to test them against.
Each file's own header comment says to delete it once one does, but that
wasn't tracked anywhere outside code comments. Phase 5b added a third,
`src/app/api/debug/mark-order-completed/route.ts`, for the same reason —
it exercises the new `awardPointsIfCompleted` points-award transaction
since no admin fulfillment UI exists yet to transition an order to
`Completed` for real. Impact: none currently — all three are QA-only,
gated by the same guards as any real route — but they're dead weight once
Phase 5 (`/account/*`) and Phase 6 (`/admin/*`) build real guarded
routes/pages to exercise instead. Action: `session-check` was deleted in
Phase 5a — `/account/*`'s `layout.tsx` and pages now exercise
`requireSession()` for real. `admin-check` and `mark-order-completed` both
stay until Phase 6 builds `/admin/*` (real fulfillment controls give
`mark-order-completed` a real route to be replaced by). Status: open,
`admin-check` and `mark-order-completed`, scheduled for Phase 6.

**Order history has no pagination.** Area: account/orders. Issue:
`getOrdersByUserId` (`src/modules/order/api/getOrdersByUserId.ts`) fetches
a user's entire order history with no `limit()`/cursor — no pagination
pattern exists anywhere else in the codebase yet either. Impact: none at
realistic portfolio-piece order volume per customer. Action: add
cursor-based pagination if a test account (or real usage) ever
accumulates enough orders to make the unpaginated list slow or unwieldy.
Status: open, deferred.

**"Order again" is a disabled placeholder on the order-history page.**
Area: account/orders, cart. Issue:
`src/modules/account/components/OrderHistoryCard.tsx` renders a
genuinely-`disabled` "Order again" button rather than a working reorder
flow. `OrderLineItem` (order module) has no `image` field and isn't a
`MenuItem`, so re-adding a past order's lines to the cart needs each
`menuItemId` re-resolved against *current* menu/option data (an item can
be discontinued or repriced since the order was placed) — real
cross-module work touching cart, menu, and order together, not a button
wire-up. Impact: none — the button is inert, not broken. Action: build
the reorder resolution path (menu-item availability re-check, current
pricing, cart re-hydration) in a future phase. Status: open, deferred.

**Saved details are read-only; two design-mock widgets were omitted.**
Area: account. Issue: Phase 5a's `/account` page shows name/email/phone
as static display only — no edit form, no update API route, no Zod
schema. The design mock's "The usual" one-tap-reorder widget and
SMS/email "Preferences" toggles were both left out entirely, since
neither has backing data (`User` has no notification-preference fields,
and a "usual order" concept doesn't exist in the data model) and adding
new `User` fields wasn't in Phase 5a's scope. Impact: none — this is
read-only display of real data, nothing broken. Action: scope
saved-details editing as its own small follow-up if/when needed; only add
preference fields to `User` if that feature is actually prioritized.
Status: open, deferred.

**`orders` collection needs a composite Firestore index for order
history.** Area: account/orders, infra. Issue:
`getOrdersByUserId`'s `where("userId","==",...).orderBy("createdAt","desc")`
compound query requires a composite index (`orders`: `userId` ASC,
`createdAt` DESC). No `firestore.indexes.json` (or equivalent
infra-as-code) exists anywhere in this repo yet, so one wasn't added
speculatively here. Impact: `/account/orders` will throw
`FAILED_PRECONDITION` the first time this query runs in any environment
without the index. Firestore's error includes a direct console link to
auto-create it. Action: click that link (or otherwise create the index)
the first time this is deployed/run against a fresh Firestore instance;
revisit adding an `firestore.indexes.json` convention if more composite
queries show up. Status: open, undeployed infra step.

**Ephemeral per-redemption Stripe Coupons accumulate in the dashboard.**
Area: checkout/Stripe, loyalty. Issue: `/api/checkout` creates a fresh
one-time-use (`duration: "once"`) Stripe Coupon per redeemed reward
(`src/app/api/checkout/route.ts`) rather than reusing or deleting them, so
the Stripe dashboard's Coupons list grows over time. A negative line item
isn't supported by Stripe, and one persistent multi-use coupon per reward
couldn't be capped correctly for small orders, so an ephemeral capped
coupon per checkout was the simplest way to keep Firestore's own
`redemption.discountAmount` authoritative. Impact: none functionally —
Coupons have no billing cost — but adds dashboard clutter. Action: revisit
only if this becomes a genuine usability nuisance (e.g. a periodic cleanup
job deleting old "once" coupons). Status: open, deferred.

**Cart may not clear if the confirmation page never loads after a
successful payment.** Area: cart/checkout. Issue: cart-clearing is
client-side only (`OrderConfirmationScreen` calling `useCart().clear()`
once it observes `paymentStatus: "Paid"`), so if the user closes the tab
or loses connectivity between Stripe's redirect firing and the
confirmation page mounting, the webhook still marks the order `Paid`
server-side but the local cart is never cleared. Impact: the customer
sees stale (already-purchased) items still in their cart on next visit;
re-ordering them would create a *second* charge, not a duplicate of the
first. Action: none planned at MVP — cart is client-only by design (see
CLAUDE.md's Cart section); revisit only if a server-side cart mirror is
ever built. Status: open, accepted risk.

**Guest orders are only recoverable via their exact post-checkout URL.**
Area: checkout/orders. Issue: `authorizeOrderAccess` grants a guest
(`order.userId === null`) access only when the `session_id` query param
matches `order.stripeSessionId` — there is no other identity to check a
guest against. If a guest closes the confirmation tab or loses that exact
URL (with `?session_id=...`), they permanently lose access to that order;
there's no magic-link/email-based recovery flow. Impact: acceptable for
guest checkout at MVP (no account, no order history to fall back to
either — that's Phase 5, account-only). Action: none planned; revisit only
if guest order recovery becomes a real support burden. Status: open,
accepted risk.

**Non-`checkout.session.completed` Stripe webhook events are acknowledged
but not handled.** Area: checkout/webhook. Issue:
`src/app/api/webhooks/stripe/route.ts` returns `200` for every event type
so Stripe doesn't retry indefinitely, but only actually processes
`checkout.session.completed`. Events like `checkout.session.expired` or
`payment_intent.payment_failed` are currently no-ops. Impact: an order
whose Checkout Session expires unused stays `Pending` forever rather than
being marked `Cancelled`/`Failed`. Action: handle `checkout.session.expired`
(and related events) if/when stale `Pending` orders become a real problem.
Status: open, deferred.

## Resolved

**Placeholder imagery was Pinterest-sourced.** ~~`assets/img` and
`assets/img-web` contained images collected from Pinterest during design
and were unlicensed.~~ Resolved 2026-09-01: those folders were deleted and
replaced with the 6 AI-generated images now in `public/images/marketing/`
(see the new open item above for their own caveats).

**Rewards page (`/account/rewards`) was a static shell.** ~~`RewardsShell.tsx`
and its content file rendered entirely static placeholder data — a points
balance, progress bar, stats row, and a reward catalog with
uniformly-disabled Redeem buttons. Neither `User` nor `Order` had any
loyalty/points fields, and no `loyalty` module existed.~~ Resolved
2026-09-03 (Phase 5b): added `pointsBalance`/`activeRedemptionOrderId` to
`User`; `redemption`/`pointsAwardedAt`/`pointsEarned` to `Order`; built
`src/modules/loyalty/` (static catalog, `awardPointsIfCompleted`
earning transaction, `reserveRedemptionOrder`/`deductRedeemedPoints`
checkout-time redemption with a single-flight balance lock). `RewardsShell`
and the new `RewardCatalogGrid` render live balance/stats/catalog with
real enable/disable state; redemption selection happens in the cart
drawer (the app's de facto checkout UI).
