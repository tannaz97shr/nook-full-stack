import Stripe from "stripe";

/** Server-only. Never import from a Client Component. */
function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const stripe = new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"));
