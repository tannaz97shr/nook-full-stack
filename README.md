# Nook

**A cozy neighbourhood cafe website with real online ordering, customer accounts, a loyalty program and a staff admin, all built from scratch.**

**Live demo → [nook-full-stack-two.vercel.app](https://nook-full-stack-two.vercel.app)**

> ### Try it
>
> You don't need an account. Open [**/sign-in**](https://nook-full-stack-two.vercel.app/sign-in) and pick one:
>
> - **Try as a customer**: browse the menu, customise a drink, check out, and see the rewards page.
> - **Try the admin, read-only**: see the menu manager, the live order queue and the rewards catalog. Changes are blocked, so look around freely.
>
> Checkout is a real Stripe payment in test mode. Use card **`4242 4242 4242 4242`**, any future expiry date, any CVC. You won't be charged.

---

## Screenshots

<table>
  <tr>
    <td><img src="docs/screenshots/home.png" alt="Home page" /></td>
    <td><img src="docs/screenshots/menu.png" alt="Menu page" /></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/customize.png" alt="Drink customisation modal" /></td>
    <td><img src="docs/screenshots/cart.png" alt="Cart drawer" /></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/admin-queue.png" alt="Admin order queue" /></td>
    <td></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/home-light.png" alt="Light mode" /></td>
    <td><img src="docs/screenshots/home-dark.png" alt="Dark mode" /></td>
  </tr>
</table>

---

## Features

**Ordering**
- Menu with photos, dietary badges, and "From $X" pricing when the price depends on a choice such as size
- Customisation for size, milk, add-ons and so on. "Add to cart" stays disabled until every required choice is made
- Cart drawer with a GST-inclusive total and an "Includes GST" line
- Secure card payment through Stripe, then an order confirmation page with the order number
- **Guest checkout**: anyone can order without an account

**Accounts & rewards**
- Sign up with email and password, or **sign in with Google**
- Order history
- **Loyalty points**: $1 spent = 1 point, credited when the order is completed. Customers can redeem a reward (free drip coffee, pastry, bag of beans…) at checkout

**Admin (for cafe staff)**
- **Menu manager**: items, categories, option groups and photo uploads, plus a one-tap **86 toggle** that marks an item sold out instantly
- **Order queue**: move orders through Received → Preparing → Ready → Completed
- **Rewards manager**: add, edit and retire rewards

**Everywhere**
- Light and dark mode
- Mobile-first, responsive layout
- **Demo mode**: one-click customer and read-only admin access for visitors

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router), TypeScript |
| Runtime / package manager | Bun |
| Styling | Tailwind CSS 3 with CSS-variable design tokens (light + dark) |
| Data fetching | Axios + TanStack Query |
| Forms | React Hook Form + Zod |
| Auth | Auth.js v5: credentials, Google, and a gated demo provider |
| Database & files | Firebase Firestore + Storage via the Admin SDK (server-only) |
| Payments | Stripe Checkout Sessions + webhooks |
| Hosting | Vercel |

---

## Architecture

### Feature modules

Every feature lives in its own module with the same internal layout:

```
src/modules/<feature>/
  api/         server-only Firestore reads/writes
  content/     all UI copy for this feature (no inline strings in components)
  components/
  hooks/
  lib/         pure logic, schemas, mappers
  types/
```

Modules: `home`, `marketing`, `menu`, `cart`, `order`, `loyalty`, `account`, `auth`, `admin`.

### Shared UI layers

Reusable UI lives in [`src/shared/components`](src/shared/components), arranged as **atoms** (Button, TextField, Switch…), then **molecules** (Modal, Drawer, Toast, ThemeToggle), then **organisms** (Header, Footer, MobileNav). The components carry the design system, so feature code needs very few Tailwind classes. All colours come from CSS variables wired into [`tailwind.config.ts`](tailwind.config.ts), and there are no hardcoded colours in components. Routes and API paths come from a single source ([`src/shared/routes.ts`](src/shared/routes.ts)).

### Server-only data access

Firebase is used only through the **Admin SDK** on the server ([`src/shared/lib/firebase-admin.ts`](src/shared/lib/firebase-admin.ts)). It is never imported into client components, and no Firebase config is exposed to the browser. Firestore documents always pass through explicit mapper functions (`toOrder`, `toMenuItem`…) and are never spread straight into responses. Every read-then-write runs inside a transaction.

### Auth guards: two independent layers

1. **Middleware** ([`src/middleware.ts`](src/middleware.ts)) redirects signed-out visitors away from account and admin pages, and non-staff away from `/admin`. It runs its own lightweight, edge-safe Auth.js instance, so it never loads the database SDK.
2. The middleware **deliberately excludes `/api`**, so **every API route checks for itself** by calling [`requireSession()`](src/modules/auth/lib/requireSession.ts) or [`requireAdminSession()`](src/modules/auth/lib/requireAdminSession.ts) at the top. A page gate alone never protects data.

---

## Engineering decisions worth a look

### Idempotent Stripe webhooks
Stripe can deliver the same event more than once. [`markOrderPaidIfUnprocessed`](src/modules/order/api/markOrderPaidIfUnprocessed.ts) runs in a Firestore transaction. It checks the order's `processedStripeEventIds` and writes only if this event hasn't been seen before, so a redelivery can't apply twice. Signatures are verified with `constructEventAsync` over the raw request body ([webhook route](src/app/api/webhooks/stripe/route.ts)). If processing fails, the route returns a 500 on purpose, which makes Stripe's automatic retry the safety net.

### Prices are re-verified at checkout
The client sends only item IDs, quantities and selected options, never prices. [`reverifyOrderLines`](src/modules/order/lib/reverifyOrderLines.ts) re-prices every line from live Firestore data. It checks that the item and each option are still available, that each option belongs to that item, and that every required choice is made. Any invalid line rejects the whole checkout with a clear error, because silently dropping a line would charge for a cart the customer never saw.

### GST-inclusive pricing in integer cents
Menu prices include GST, as Australian customers expect. The GST shown is total ÷ 11, rounded once in whole cents ([`gst.ts`](src/modules/order/lib/gst.ts)). The cart drawer and the checkout API compute totals with the same function, so the displayed and charged figures can't round differently. As a final guard, [checkout](src/app/api/checkout/route.ts) refuses to start if the cents Stripe will charge don't exactly match the order total being stored.

### Points are earned on completion, not payment
[`awardPointsIfCompleted`](src/modules/loyalty/api/awardPointsIfCompleted.ts) credits points in the **same transaction** that marks an order Completed. A `pointsAwardedAt` marker guards it, so points can never be awarded twice. Points are based on the amount actually paid after any reward, so reward value doesn't earn more points. Guest orders don't earn points.

### Reward redemption as a one-time Stripe coupon
Stripe doesn't allow negative line items. Instead, each redemption creates a single-use coupon sized to the server-calculated discount, capped at the order total. The reward is checked twice: a quick read first ([`verifyRedemption`](src/modules/loyalty/lib/verifyRedemption.ts)), then inside a transaction that holds a single-flight lock on the customer's balance ([`reserveRedemptionOrder`](src/modules/loyalty/api/reserveRedemptionOrder.ts)). Points are deducted only when the payment webhook arrives, inside the same exactly-once transaction, so an abandoned checkout never costs the customer points.

### Magic-byte validation for image uploads
Admin photo uploads are identified by their actual file signature bytes (JPEG, PNG, WebP), not by the file name or the browser's claimed type, before anything is written to Storage ([`detectImageType`](src/modules/menu/lib/detectImageType.ts)). This was originally done with a third-party package, but Next's output file tracing missed its ESM imports and the deployed route crashed on load, so it's now a small in-house check. Images are served through token-gated download URLs, not public buckets.

### A read-only demo admin, enforced on the server
Portfolio visitors can explore the real admin without being able to change anything. [`roles.ts`](src/modules/auth/lib/roles.ts) separates **can view** admin from **can change** admin. Middleware and pages use the first. `requireAdminSession()` uses the second, so **every** admin API route rejects the demo admin with a 403 (`code: "demo-read-only"`) and no per-route special cases. The demo sign-in is passwordless but tightly scoped: the browser sends only a persona name, the account emails are hardcoded on the server, the stored account must be a demo account with exactly the expected role, and the whole provider is switched off unless a server-only environment flag is set. Orders from the demo customer are tagged and hidden from the real admin's queue and stats.

### Debugging the cart sign-in bug: three root causes, not one
QA once saw the first two items added right after signing in vanish, while the cart count flickered between 6 and 0. The obvious suspect was a race while the cart switched from the guest key to the user key. Instrumented, throttled Playwright runs ruled that out and found three separate causes:

1. **Clicks before hydration were dropped.** Add buttons are in the server-rendered HTML, so they could be clicked before React attached handlers. They now render disabled until the component has mounted and the cart has loaded. Gating on mount matters, not just on "cart loaded": on `/menu` the menu grid streams in after the cart has loaded, and React 18 never patches a mismatched `disabled` attribute after hydration, so the buttons would have stayed disabled.
2. **The guest cart was never carried over.** On sign-in the guest cart is now merged into the account cart ([`mergeGuestCart`](src/modules/cart/lib/mergeGuestCart.ts)). Matching lines combine, and the merge is idempotent, so it is safe under Strict Mode and across repeated sign-ins.
3. **Two open tabs overwrote each other.** Each tab saved its own stale copy of the cart. Tabs now listen for `storage` events and re-read the cart, and identical writes are skipped.

Two other suspects (bfcache restoring the old page, and adds landing before the cart's first read) were tested and ruled out. The full write-up is in [`specs/known-issues.md`](specs/known-issues.md) under Resolved.

---

## How it was verified

- **Live browser QA** against a running dev or production build, at desktop and mobile sizes, in light and dark mode, with screenshots inspected directly. Each feature got its own scripted Playwright run.
- **Real Stripe test-mode payments** end to end: Checkout Session → webhook → order marked Paid. Tested with a successful card (`4242 4242 4242 4242`) and a declined card (`4000 0000 0000 0002`), not synthetic events.
- **Both directions of every permission check**: customers blocked from admin *and* admins allowed in, signed-out users redirected *and* signed-in users admitted, the demo admin able to view *and* refused on every change.

---

## Running locally

**Prerequisites:** [Bun](https://bun.sh), the [Stripe CLI](https://stripe.com/docs/stripe-cli), a Firebase project with Firestore and Storage enabled, a Stripe account in test mode, and (optionally) Google OAuth credentials.

```bash
bun install
cp .env.example .env.local   # then fill in the values
```

`.env.local` needs:

- **Firebase Admin**: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_STORAGE_BUCKET`, taken from a service-account key
- **Auth.js**: `AUTH_SECRET`, plus `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` for Google sign-in
- **Stripe**: `STRIPE_SECRET_KEY` (test key) and `STRIPE_WEBHOOK_SECRET` (see below)
- **Demo mode**: `DEMO_ACCESS_ENABLED=true` to turn on the one-click demo buttons

**Seed Firestore.** Each script does a dry run by default and writes only with `--apply`. Re-running a script is a safe upsert.

```bash
bun run scripts/seed-menu.ts --apply        # categories, option groups, options, items
bun run scripts/seed-rewards.ts --apply     # rewards catalog
bun run scripts/seed-demo-users.ts --apply  # demo customer + read-only demo admin
bun run scripts/seed-test-users.ts --apply  # optional: a test customer and a real admin
```

**Run it.** Use two terminals:

```bash
bun dev                  # http://localhost:3000
bun run stripe:listen    # forwards Stripe webhooks to localhost
```

`stripe:listen` reads your Stripe key from `.env.local` and prints a `whsec_…` signing secret. Copy it into `STRIPE_WEBHOOK_SECRET` and restart `bun dev`. The secret changes between listener sessions.

> **First run:** order history (`/account/orders`) needs a Firestore composite index on `orders` (`userId` ascending, `createdAt` descending). The first time the page loads, Firestore's error message includes a link that creates it in one click.

---

## Known issues

Open items, deliberate MVP trade-offs and resolved investigations are tracked in [`specs/known-issues.md`](specs/known-issues.md). Two headline items: Stripe currently settles in USD rather than AUD, and every menu item is treated as GST-taxable.
