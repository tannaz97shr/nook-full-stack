# Nook — Project Spec

Portfolio piece: a full-stack cafe website built to advertise freelance
full-stack web development work. Companion doc to the general-purpose
playbooks (`ai-assisted-development-playbook.md`,
`code-and-technical-decisions.md`, `future-project-kickoff-checklist.md`).
Those cover *process and technical defaults*; this covers *what Nook
specifically is*.

## Concept

- Name: **Nook**
- Vibe: cozy, warm neighborhood cafe — not corporate, not overly polished
- Purpose: demonstrate both visual/UI design skill and full-stack
  functionality (ordering, accounts, loyalty, admin) equally
- Design references: collected from screenshots (Lula Cafe, Saxbys,
  Stumptown) as structural/stylistic inspiration only — not to be copied
  directly (different brand, name, palette, copy, imagery)

## Roles

- **Guest** — browses menu, can order without an account
- **Customer** (account) — order history, saved details, loyalty points
- **Admin** — manages menu, orders, loyalty program

## MVP Scope

### Marketing / Content
- Home (hero, highlights, CTA)
- Menu (browsable, with images)
- Gallery (interior/food photos)
- About/story
- Contact + location + hours + map

### Ordering
- Customizable add-to-cart (size, milk, add-ons)
- Cart page/drawer
- Checkout with Stripe (test mode)
- Order confirmation page
- Order status tracking: Received → Preparing → Ready → Completed
- Guest checkout supported (no account required to order)

### Accounts
- Login/signup: email/password + Google OAuth
- Order history
- Saved details (name, phone) for faster reorder

### Loyalty
- **Points-based** model (e.g. $1 spent = 1 point), admin-configurable
  thresholds/rewards
- **Account-only** — guest checkouts do not earn or redeem points; no
  retroactive point-claiming
- Rewards page showing progress
- Redeem reward at checkout

### Admin
- Menu management: items, categories, option groups, 86 (availability)
  toggle
- Order management: view/update order status
- Loyalty program management: point rules, rewards catalog

### Explicitly Out of Scope
- Group/table booking (no form, no admin section)
- Combo/bundle items (deferred)
- Dietary filter bar — badges on item cards only, no filtering UI
- Password reset flow (deferred, consistent with prior project)

## Menu & Item Customization — Detailed Spec

### Data shape

**Category**
- id, name, description?, displayOrder, isActive

**MenuItem**
- id, categoryId, name, description, basePrice, image(s)
- dietaryTags[] (vegan, gf, dairy-free, contains-nuts, etc.)
- isAvailable (86'd flag)
- displayOrder
- optionGroups[] (references OptionGroup)

**OptionGroup** (reusable across items, e.g. "Milk Type" used by every coffee)
- id, name (e.g. "Size", "Milk", "Extra Shots")
- selectionType: single | multiple
- isRequired
- minSelect, maxSelect (for multiple type)
- options[] (references Option)

**Option**
- id, optionGroupId, name (e.g. "Oat Milk", "Large", "Extra Shot")
- priceModifier (+0, +0.50, +1.00, etc.)
- isAvailable

**Key design decision:** OptionGroups are their own entity, not nested
inside MenuItem, so a group like "Milk Type" is defined once and attached
to every relevant item rather than duplicated. Mirrors the reusable-
component pattern used for bouquets in a prior project (Tulips) — updating
an option's price/availability updates everywhere it's used.

### States
- Menu item card: available / unavailable (86'd, grayed out, "Sold out",
  not addable)
- Item with required customization → opens a modal/drawer on "Add"
- Item with no customization → adds instantly with quick "+1" feedback
- Customization modal: required groups start unselected; "Add to cart"
  disabled until all required groups have a valid selection
- Empty category (no items) → hide the category tab entirely

### Confirmed edge case handling
- **Item/option becomes unavailable while in an active cart** → auto-remove
  the affected line item + toast notification (not a checkout-time block)
- Price display: "From $X" on cards when required paid modifiers exist
  (e.g. size), flat price otherwise
- Dietary tags: visual badges only, no filter bar (MVP)
- Combo/bundle items: deferred, not in MVP schema

### Deferred (nice-to-have, not blocking)
- Sticky category nav on scroll
- Auto-select last remaining option in a required group
- Quantity stepper: defaulting to cart-only (not inside the customization
  modal), to keep the modal simpler

## Loyalty — Confirmed Decisions
- Points-based, not stamp-card
- Account-only — no guest participation, no retroactive claiming
- Guest checkout still fully supported for ordering; account creation is
  the natural upsell point ("create an account to start earning points on
  this order")

## Tooling Workflow
1. Plan features/decisions in this Claude Project
2. Design UI direction in Claude Design, informed by reference screenshots
3. Implement in Claude Code (VS Code), following the attached playbooks
4. QA live flows with Claude in Chrome
5. Feed learnings back into this Project's knowledge files to stay in sync
