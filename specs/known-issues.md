# Known Issues

Open items tracked per CLAUDE.md § Known open items: undeployed infra
steps, deferred features, investigated-but-unreproduced bugs, un-applied
migration scripts, known UX gaps.

## Open

**Every menu item is treated as GST-taxable.** Area: order/pricing.
Issue: menu prices are GST-inclusive, and the "Includes GST" figure is
always total ÷ 11 (`order/lib/gst.ts`). Real cafes sell some GST-free
food (e.g. basic unprepared food such as plain bread or fresh fruit),
which this doesn't model. Impact: the informational GST line overstates
GST on any order containing a GST-free item. The amount charged is
unaffected. Action: if needed, add a per-item `gstFree` flag snapshotted
onto order line items, and compute GST over the taxable lines only (with
a rule for apportioning a reward discount across taxable and GST-free
lines). Status: open, deliberate MVP simplification.

**Currency is USD, not AUD.** Area: checkout, shared utils. Issue:
Stripe Checkout Sessions and reward coupons are created with
`currency: "usd"`, and `formatMoney` formats as `en-US`/`USD`. That
doesn't match the cafe's Australian, GST-inclusive pricing. Impact:
display shows "$", so it looks right, but Stripe settles in USD and
receipts say USD. Action: switch to `aud` (Stripe, coupons) and
`en-AU`/`AUD` (`format-money.ts`) together. Do it in its own change,
since every Stripe amount and test flow is affected. Status: open, noted
during the GST-inclusive pricing change.

**Add-to-cart toast overlaps the cart drawer's Checkout button on mobile.**
Area: cart, shared components. Issue: `ToastProvider` positions toasts with
`fixed inset-x-0 bottom-6 z-[70]` (full viewport width, centered, above the
drawer's `z-[60]`) so a toast stays visible even while a drawer/modal is
open. On desktop the `CartDrawer` is a right-aligned side panel, so a
centered full-width toast lands in the page area to its left and never
overlaps it — but on mobile the drawer is a full-width bottom sheet, so the
toast renders directly on top of the drawer's sticky footer, visually
covering the "Checkout · $X.XX" button text for the ~3s the toast is
visible (`animation: "toast 3s ease-in-out forwards"` in
`tailwind.config.ts`). Reproduced by adding an item from `/menu` at a
mobile viewport, then opening the cart drawer while the toast is still
showing. Not theme-specific (happens in both light and dark). Impact: the
button is very likely still clickable underneath (toast has no visible
pointer-events guard either way), but its label is unreadable while
covered, which reads as broken. Action: needs a real fix in shared
Toast/Drawer layering (e.g. suppressing/repositioning toasts while a
drawer is open on narrow viewports, or giving the drawer's sticky footer a
higher stacking context) — out of scope to patch during a presentation-
layer polish pass since it touches shared component behavior used
app-wide, not just cart. Status: open, found during the Phase 7 full-app
mobile/dark-mode QA sweep.

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

**Uploaded-but-unattached admin images orphan in Storage.** Area:
admin/menu, Storage. Issue: `AdminItemForm` uploads an image to
`/api/admin/menu/images` immediately on file-select (before the rest of
the form is valid/submitted), so an admin who picks a file and then
abandons the form leaves an orphaned object under `menu-items/` in the
bucket with no Firestore doc ever referencing it. Impact: none
functionally, minor storage cost accumulation. Action: revisit with a
periodic cleanup job (e.g. delete `menu-items/*` objects older than N
hours with no referencing `MenuItem.images` entry) if this becomes a real
cost/clutter concern. Status: open, deferred.

**Category/item drag-and-drop reordering was scoped out of Phase 6a.**
Area: admin/menu. Issue: the design mock shows drag-handle reordering for
categories, but Phase 6a's `createCategory`/`createMenuItem` only append
at the end (`displayOrder` = current max + 1) — there's no
`reorderCategories` write function or drag UI. Impact: staff can't
reorder categories/items from the admin UI; new ones always land last.
Action: revisit if manual reordering becomes a real need. Status: open,
deferred.

**Demo orders accumulate in Firestore and the demo-admin queue.** Area:
order, demo access. Issue: orders placed by `demo-customer@nook.local`
are tagged `isDemo: true` and hidden from the real admin queue and stats
(`order/lib/filterOrdersForAdminView.ts`). The demo-admin is read-only,
though, so nothing ever advances or completes them. They stay
"Received" forever and are never cleaned up. Impact: the demo-admin's
"In queue" count and the demo customer's order history (no pagination)
grow with every portfolio checkout. The real admin is unaffected.
Action: if it gets noisy, add a dry-run-by-default
`scripts/cleanup-demo-orders.ts --apply` that deletes `isDemo` orders
older than N days, or a Vercel cron doing the same. Status: open,
accepted trade-off of tagging over scheduled cleanup.

**Phase 3 debug route needs deletion once a real protected route exists.**
Area: auth. Issue: `src/app/api/debug/admin-check/route.ts` was added purely
to exercise `requireAdminSession()` live, since Phase 3 built the guard but
no real admin-only API route existed yet to test it against. Its own
header comment says to delete it once one does, but that wasn't tracked
anywhere outside code comments. Impact: none currently — it's QA-only,
gated by the same guard as any real route — but it's dead weight now that
Phase 6a/6b have built real admin-only routes it could be replaced by
exercising instead (`session-check` and `mark-order-completed`, its
siblings from the same original combined item, were already resolved in
Phase 5a and 6b respectively — see Resolved, below). Status: open,
`admin-check`, scheduled for a future admin-route phase.

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

**No public `/rewards` explainer page.** Area: marketing/loyalty. Issue: the
homepage design's rewards banner has a secondary "How it works" button
linking to `/rewards`, which doesn't exist — only the protected
`/account/rewards`. Phase 8 dropped the button rather than link guests into
a sign-in bounce. Impact: guests get only "Join rewards". Action: build a
public explainer page and restore the button (`ROUTES` entry + a
`secondary`-style on-photo `ButtonLink` variant). Status: open, deferred.

**Public holiday list runs out after 2027 — extend before 2028.** Area:
home, shared hours. Issue: `VIC_PUBLIC_HOLIDAYS` in
`src/shared/content/opening-hours.ts` (the same source as footer/contact
hours) covers 2026–2027 only (`PUBLIC_HOLIDAYS_COVERED_THROUGH = 2027`).
It also deliberately omits **AFL Grand Final Friday 2027**: the date depends
on the AFL fixture and isn't confirmed (aggregators guess Fri 24 Sep), and a
wrong guess would show "Closed" on a real trading day. Impact: from 1 Jan
2028, and on GF Friday 2027, the homepage badge treats holidays as normal
trading days. Action: add GF Friday 2027 once the AFL confirms it; add 2028+
dates from Business Victoria before the end of 2027. Status: open,
scheduled.

**Primary (gold-fill) buttons fail WCAG AA in light mode.** Area: design
tokens, shared Button. Issue: `gold-ink` text (#fff9ee) on the `gold` fill
(#b07c35) is 3.47:1. At 16px bold that isn't "large text", so it needs 4.5:1.
Affects every primary button and the header Cart pill. Phase 8's contrast
fix added a separate `--color-gold-text` for gold *text* and left the fill
alone on purpose. Action: brand decision — a light-mode fill of about
`#94682d` gives 4.68:1 but visibly browns every CTA. Status: open, needs
decision.

**Opacity-dimmed text fails AA in two components.** Area: menu, admin/orders.
Issue: found by Phase 8's light-mode contrast scan. The category-tab counts in
`CategoryTabs.tsx` use `opacity-60` (2.22:1 on the active gold tab, 3.09:1
on inactive tabs). Completed rows in `AdminOrderQueueTable.tsx` are
`opacity-60` (2.56–4.34:1). Both are component-level opacity, not token
colours, so the Phase 8 token fix doesn't reach them. Action: replace the
opacity with a token colour (e.g. `text-ink-subtle`, or `text-gold-ink` on
the active tab). Status: open.

**Item photos still announce the item name twice in two places.** Area:
cart, menu. Issue: `MenuItemCard` images are now decorative (`alt=""`),
because the name is the heading right below. `CartLineItemRow` (cart, out of
Phase 8 scope) and `ItemCustomizationModal` (image above its own `<h2>`)
still use `alt={name}`. Impact: screen readers read the name twice there.
Action: set both to `alt=""`. Status: open.

**`isFeatured` isn't in the seed data that's been applied.** Area:
menu/seed. Issue: Phase 8 added `isFeatured` to `scripts/seed-menu.ts`, but
the seed wasn't re-run; live items were flagged through the admin form
instead. Missing fields read as `false` (`toMenuItem.ts`), so no migration
is required. Impact: a fresh environment seeded from the old script shows
no featured row until items are flagged. Status: open, informational.

**Admin availability switch knob overlaps its "Available" label.** Area:
admin/menu. Issue: in `AdminItemsTable.tsx` the switch knob is
`absolute` with no `left-0`, so in the "on" state (`translate-x-[21px]`)
it renders past the track and covers the first letter ("vailable").
Confirmed pre-existing during Phase 8 (reproduced with the Phase 8 table
change stashed). Impact: cosmetic. Action: anchor the knob with `left-0`.
Status: open.

**Stale references to the removed `design/` folder.** Area: docs/config.
Issue: f5d3452 deleted `design/`, but CLAUDE.md, the `tailwind.config.ts`
colors comment, `src/shared/routes.ts`, and the Tailwind-v4 entry above
still point at files in it. `globals.css` + `tailwind.config.ts` are now the
token source of truth. Action: update those references. Status: open.

**`Modal` doesn't trap focus or lock scroll yet.** Area: shared
components. Issue: `Drawer` now uses `useDialogBehavior` (Escape, focus
in on open and back to the opener on close, Tab trap, body scroll lock),
but `Modal` still only handles Escape, and its backdrop close button can
be reached with Tab. Impact: keyboard users in `ItemCustomizationModal`
and the admin form modals can tab out behind the overlay, and the page
scrolls underneath. Action: call `useDialogBehavior` from `Modal` (ref on
the dialog div, `tabIndex={-1}`, backdrop `tabIndex={-1}`), then re-check
each modal's initial focus. Status: open, deferred from fix/mobile-nav
to keep that branch scoped.

**`ALWAYS_OPEN` is on for the portfolio deployment.** Area: home, shared
hours. Issue: `ALWAYS_OPEN = true` in `src/shared/content/opening-hours.ts`
makes `getOpenStatus` return `always-open` at every hour, so the homepage
badge always reads "Open now · order ahead". The contact page also drops its
"Public holidays: Closed" row. The real Melbourne-time hours, closing-soon
and public-holiday logic is still in place but unused. Ordering was never
time-gated (no hours check in the menu, cart or `/api/checkout`). Action:
set it to `false` for a real trading deployment. Nothing else needs to
change. Status: open, deliberate for the portfolio demo.

**Admin, rewards and footer dates use the server's timezone, not
Melbourne.** Area: admin/orders, loyalty, shared footer. Issue:
`computeAdminOrderStats` ("today" counts) and `formatOrderQueueTimestamp`
use `toDateString()` and an `Intl.DateTimeFormat` with no `timeZone`.
`computeRewardsStats` and the footer © use `getFullYear()`. All of them
render on the server, which is UTC on Vercel. Impact: admin queue times
show in UTC, and "today" rolls over at 10–11am Melbourne time. The rewards
"this year" count and the © year are wrong for about 11 hours around New
Year. Action: pass `timeZone: CAFE_TIMEZONE`, and compare Melbourne-local
dates the way `getOpenStatus` does. Status: open, found during the
always-open audit.

## Resolved

**Items possibly lost on add right after sign-in.** ~~Seen once in QA:
the first two adds right after signing in never reached the cart, and the
header count flipped between 6 and 0. Suspected cause: the cart key
switching from guest to user id mid-add.~~ Resolved 2026-10-12
(fix/cart-sign-in-race). Reproduced with instrumented Playwright runs; it
was not a key-switch race (`userId` is server-derived and fixed per
document load, so there's no client "session loading" window). It was three
separate causes:
1. **Pre-hydration clicks were dead.** Add buttons are in the server HTML,
   so they were visible and clickable before React attached handlers. A
   click in that gap was silently dropped. Dev: 12/12 throttled runs lost
   both adds (gap up to ~13s on Fast 3G while dev bundles load). Prod: the
   homepage featured row had a ~35–90ms window. `/menu` in prod did not,
   because its grid streams in behind `menu/loading.tsx` after hydration.
   Fix: Choose, quick-add and the modal's "Add to cart" render disabled
   (soft `pending` Button style plus `aria-busy`) until the component has
   mounted and the cart has hydrated. Gating on `useHasMounted`, not
   `cart.isHydrated` alone, matters: on `/menu` the streamed grid hydrates
   after CartProvider, so `isHydrated` is already true while the server HTML
   says disabled. React 18 never patches that attribute mismatch, so the
   button would have stayed disabled.
2. **The guest cart was never carried over.** On sign-in the header went
   from the guest cart (6) to the empty account cart (0), and items added
   in a tab still on the pre-sign-in page went to the guest cart, invisible
   after sign-in. Fix: `cart/lib/mergeGuestCart.ts` merges the guest cart
   into the account cart in CartProvider's hydration effect, whenever the
   user is signed in and this device's guest cart has items. Matching lines
   sum quantities, the account's reward is kept, and the guest cart is
   deleted in the same effect, so it's idempotent under Strict Mode and on
   sign-out/sign-in. A toast reports how many items were added.
3. **Two tabs overwrote each other.** Each tab persisted its own stale
   in-memory cart (last writer wins: an add in tab A was erased by an add in
   tab B). Fix: a `storage` listener re-reads this tab's own cart key, and
   `writeCart` skips writes identical to what's stored.

Ruled out: adds landing between hydration and the cart's storage read (React
flushes the hydration effect first; never lost), and bfcache restoring the
pre-sign-in page (`Cache-Control: no-store` prevents it). Reconcile's
non-functional `setItems` was only checked by reading the code. Exercising
it needs an unavailable menu item, and dev shares production Firebase.

**Production og:image / twitter:image pointed at localhost.** ~~`metadataBase`
came from `SITE_URL` with a `http://localhost:3000` fallback, and `SITE_URL`
was never set on Vercel, so production link previews used
`http://localhost:3000/opengraph-image.jpg`.~~ Resolved 2026-10-11:
`src/shared/site.ts` now resolves `SITE_URL` override → Vercel production
domain (`VERCEL_PROJECT_PRODUCTION_URL`) → preview deployment URL
(`VERCEL_URL`) → localhost. It relies on Vercel's "Automatically expose
System Environment Variables" setting, which is on by default. Set `SITE_URL`
only if a custom domain should win over the Vercel-reported one.

**Marketing images were AI-generated placeholders, not real cafe
photography.** ~~`public/images/marketing/` (hero-latte-art.jpg,
interior-warm.jpg, storefront-exterior.jpg, coffee-closeup.jpg,
outdoor-table.jpg, pastry-closeup.jpg) were generated via ChatGPT to
replace the earlier Pinterest-sourced set — fine for development but
should be disclosed as AI-generated if this project comes up in a
portfolio/client conversation.~~ Resolved 2026-09-08 (Phase 7): replaced
all six with real, licensed photography from Unsplash (Unsplash License —
free for commercial use, no attribution required):
`interior-bookshelf.jpg`, `interior-warm-light.jpg`, `interior-tables.jpg`,
`interior-garden-view.jpg`, `coffee-latte-hands.jpg`,
`coffee-latte-saucer.jpg`, `pastry-croissant-honey.jpg` — seven images,
covering the new `/gallery` grid, `/about`'s hero/first-year/CTA photos,
`/contact`'s photo slot, and `AuthScreen`'s sign-in background (previously
`coffee-closeup.jpg`, now `coffee-latte-hands.jpg`). An eighth sourced photo
(Unsplash id `1550005399-c95f859c0fc7`, page-titled "croissant breads near
basket full of pastry on table") was downloaded but not used: the actual
image behind that URL is an unrelated colorful food-market scene, not
croissants — Unsplash's own alt text for it is simply wrong — and it read
as a jarring style mismatch against the site's muted, minimalist palette.
No exterior/storefront shot was available in the sourced set either;
`/contact` uses an interior photo in that slot instead rather than
misrepresenting one as the shopfront.

**Deleting the old placeholder marketing images broke 9 seeded menu item
photos.** ~~`scripts/seed-menu.ts` reused three of the six old
`public/images/marketing/*` placeholder files as stand-in photos for 9
menu items (`hero-latte-art.jpg` for Flat White, `coffee-closeup.jpg` for
4 coffee/cold items, `pastry-closeup.jpg` for 4 breakfast/bakery items) —
a reuse this repo's own `MenuItem.images` convention treats as normal
(seeded items intentionally share a small set of stock photos rather than
getting one photo each). The same Phase 7 image-swap above deleted those
files, but the grep sweep done at the time only checked `src/` and
`specs/`, missing `scripts/seed-menu.ts` and the live Firestore data it
had already written. The break was invisible in casual QA because Next's
on-disk image-optimizer cache (`.next/cache/images/`) already had 640px
variants of the deleted files cached from earlier phases and kept serving
those stale bytes; it only surfaced as a genuine broken image (`400` from
`/_next/image`) at an uncached width — specifically the item-customization
modal's larger desktop-width request — found during the Phase 7 full-app
QA sweep.~~ Resolved 2026-09-08 (Phase 7): remapped all 9 references in
`scripts/seed-menu.ts` to real photos (`coffee-latte-saucer.jpg` for Flat
White, `coffee-latte-hands.jpg` for the other coffee/cold items,
`pastry-croissant-honey.jpg` for breakfast/bakery items — mirroring the
exact same reuse pattern the old seed data used) and re-ran
`bun run scripts/seed-menu.ts --apply` to upsert the live Firestore
documents (safe/idempotent per the script's own deterministic doc-id
design). Confirms the sweep-and-grep step for any future asset removal
needs to cover `scripts/` (and ideally live data), not just `src/`/`specs/`.

**Rewards catalog was a hardcoded array, and OrderRedemption didn't snapshot
reward name.** ~~`src/modules/loyalty/content/rewardsCatalog.ts` held the 4
rewards as a static `REWARDS_CATALOG` array with no admin editing, and
`OrderRedemption` stored only `{ rewardId, pointsCost, discountAmount }` — no
`name` — so a future catalog edit/deactivation would have silently broken
`OrderConfirmationScreen`'s live lookup for past orders.~~ Resolved
2026-09-08 (Phase 6c): migrated the catalog to a `rewards` Firestore
collection (`isActive` soft-delete, mirroring the menu-item 86 pattern) with
full admin CRUD at `/admin/loyalty`, following Phase 6a/6b's patterns
exactly (`requireAdminSession`-guarded routes, RHF+Zod form, optimistic
toggle). Added `OrderRedemption.name` as a checkout-time snapshot (mirroring
`OrderLineItem.name`) so `OrderConfirmationScreen` no longer needs any
catalog lookup, and past orders stay correct after a reward is edited or
deactivated. `getRewardById` (used by `verifyRedemption`'s server-side
re-verification) became async and now also rejects a deactivated reward,
closing a gap where an inactive reward could previously still be redeemed
by id. `RewardCatalogGrid`/`RewardsShell` (RSC-fed) and `CartDrawer` (new
`useRewardsCatalog` hook, mirroring `useLoyaltyBalance`) both read the live
Firestore catalog now instead of the static array.

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

**Menu item photos still needed a real storage decision.** ~~The 6
marketing images above live in `public/` (static, bundled at build time)
because they're fixed design assets, not admin-editable data. Actual
per-`MenuItem` photos (added/replaced by an admin) are a different case
and should go through Firebase Storage with token-gated download URLs,
per CLAUDE.md's Images convention — this hadn't been built yet since the
data layer didn't exist until Phase 2.~~ Resolved 2026-09-07 (Phase 6a):
added `adminStorage` (Firebase Storage bucket) to
`src/shared/lib/firebase-admin.ts`; built
`src/app/api/admin/menu/images/route.ts` (multipart upload,
`requireAdminSession`-guarded, `file-type` magic-byte validation before
any Storage write); `src/modules/menu/api/uploadMenuItemImage.ts` writes
to `menu-items/{uuid}.{ext}` and returns a token-gated download URL via
the new `src/shared/lib/storageDownloadUrl.ts` helper
(`firebaseStorageDownloadTokens` custom metadata, per the Admin SDK's
actual mechanism — there's no client-SDK-style `getDownloadURL()`
server-side). `AdminItemForm` uploads on file-select and attaches the
resulting URL into `MenuItem.images` on submit. Existing seeded items
(`scripts/seed-menu.ts`) still use `public/` paths — both are valid
string values in `MenuItem.images`; only admin-added images go through
this pipeline.

**Phase 5b's `mark-order-completed` debug route stood in for real admin
fulfillment controls.** ~~`src/app/api/debug/mark-order-completed/route.ts`
and `scripts/debug-award-loyalty-points.ts` both called
`awardPointsIfCompleted` directly (over HTTP and in-process respectively)
since Phase 5b built the points-award transaction but no admin fulfillment
UI existed yet to trigger a real Completed transition.~~ Resolved
2026-09-07 (Phase 6b): built `/admin/orders` (order queue, RSC-fetched,
client-side status-tab filtering, stat tiles) and its guarded
`PATCH /api/admin/orders/[orderId]/status` route, which calls
`awardPointsIfCompleted` directly for the Completed transition (reusing
it unchanged) and a new `advanceFulfillmentStatus` transaction for
Received→Preparing/Preparing→Ready. Both debug files deleted — the real
route now exercises `awardPointsIfCompleted` for real, and staff have an
actual queue to work from instead of a QA-only endpoint.
