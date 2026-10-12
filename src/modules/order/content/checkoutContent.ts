import { STRIPE_TEST_CARD } from "@/shared/content/demo-content";

/** Shown above the Pay button on Stripe's hosted Checkout page, where the visitor actually types the card. */
export const STRIPE_CHECKOUT_DEMO_MESSAGE = `Demo store: Stripe test mode, no real charge. Pay with card ${STRIPE_TEST_CARD}, any future expiry date and any CVC.`;
