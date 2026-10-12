/**
 * Demo-store copy shared across modules (cart, checkout, admin). The whole
 * deployment runs Stripe in test mode, so the test card is safe to show
 * to every visitor.
 */
export const STRIPE_TEST_CARD = "4242 4242 4242 4242";

export const DEMO_READ_ONLY_MESSAGE = "Demo mode: changes are disabled.";
