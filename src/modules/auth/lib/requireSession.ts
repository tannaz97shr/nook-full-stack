import { auth } from "@/auth";
import type { SessionUser } from "../types/session-user";

export type SessionGuardResult = { session: { user: SessionUser } } | { error: Response };

/**
 * Checked independently at the top of every relevant API route — never
 * rely on middleware alone, since its matcher excludes /api.
 */
export async function requireSession(): Promise<SessionGuardResult> {
  const session = await auth();
  if (!session?.user) {
    return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session: { user: session.user } };
}
