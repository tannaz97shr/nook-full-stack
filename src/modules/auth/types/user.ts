export type Role = "customer" | "admin";
export type AuthProvider = "credentials" | "google";

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
