/** "demo-admin": can view every admin page, but every admin mutation is rejected server-side (see lib/roles.ts). */
export type Role = "customer" | "admin" | "demo-admin";
/** "demo": passwordless portfolio accounts, signed into only via the "demo" provider (see lib/demoAccounts.ts). */
export type AuthProvider = "credentials" | "google" | "demo";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: Role;
  authProvider: AuthProvider;
  /** Integer, never negative. Account-only — guests never accrue. */
  pointsBalance: number;
  /**
   * Single-flight redemption lock: the order id currently reserving a
   * points redemption for this user, or null. See
   * loyalty/api/reserveRedemptionOrder.ts.
   */
  activeRedemptionOrderId: string | null;
  createdAt: number;
  updatedAt: number;
}
