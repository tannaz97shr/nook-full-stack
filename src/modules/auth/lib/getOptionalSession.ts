import { auth } from "@/auth";
import type { SessionUser } from "../types/session-user";

/**
 * For routes that must work for both guests and signed-in users (e.g.
 * checkout). Deliberately never returns an error/401 — unlike
 * requireSession, a missing session here is a valid, first-class case,
 * not a rejection.
 */
export async function getOptionalSession(): Promise<SessionUser | null> {
  const session = await auth();
  return session?.user ?? null;
}
