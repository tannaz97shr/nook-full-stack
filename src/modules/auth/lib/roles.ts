import type { Role } from "../types/user";

/**
 * Edge-safe (no firebase-admin/bcryptjs) so middleware.ts can import it.
 *
 * Two separate questions, deliberately: a demo-admin can open every admin
 * page and see real data, but only a real admin may change anything.
 * requireAdminSession() uses canMutateAdmin, so every admin API route is
 * read-only for demo-admin without any per-route check.
 */
export function canViewAdmin(role: Role | undefined): boolean {
  return role === "admin" || role === "demo-admin";
}

export function canMutateAdmin(role: Role | undefined): boolean {
  return role === "admin";
}
