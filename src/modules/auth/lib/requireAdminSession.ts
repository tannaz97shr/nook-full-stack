import { requireSession, type SessionGuardResult } from "./requireSession";

/**
 * Checked independently at the top of every admin-only API route — never
 * rely on middleware alone, since its matcher excludes /api.
 */
export async function requireAdminSession(): Promise<SessionGuardResult> {
  const result = await requireSession();
  if ("error" in result) return result;
  if (result.session.user.role !== "admin") {
    return { error: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}
