import type { Role } from "../types/user";

export type DemoPersona = "customer" | "admin";

/**
 * The only accounts the passwordless "demo" provider in auth.ts can sign
 * into. Emails are hardcoded here, never taken from the request, and the
 * provider also requires the stored doc's authProvider to be "demo" and
 * its role to match — so it can never mint a real admin session.
 * Seeded by scripts/seed-demo-users.ts.
 */
export const DEMO_ACCOUNTS: Record<DemoPersona, { email: string; name: string; role: Role }> = {
  customer: { email: "demo-customer@nook.local", name: "Demo Customer", role: "customer" },
  admin: { email: "demo-admin@nook.local", name: "Demo Admin", role: "demo-admin" },
};

export function isDemoAccountEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return Object.values(DEMO_ACCOUNTS).some((account) => account.email === normalized);
}

/** Server-only kill switch: one-click demo sign-in only works when this env var is exactly "true". */
export function isDemoAccessEnabled(): boolean {
  return process.env.DEMO_ACCESS_ENABLED === "true";
}
