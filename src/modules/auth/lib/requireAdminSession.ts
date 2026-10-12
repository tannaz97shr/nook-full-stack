import { DEMO_READ_ONLY_MESSAGE } from "@/shared/content/demo-content";
import { DEMO_READ_ONLY_CODE } from "@/shared/utils/demo-read-only";
import { canMutateAdmin } from "./roles";
import { requireSession, type SessionGuardResult } from "./requireSession";

/**
 * Checked independently at the top of every admin-only API route — never
 * rely on middleware alone, since its matcher excludes /api.
 *
 * Every admin API route is a mutation (admin pages read in server
 * components), so this admits only a real admin: a demo-admin gets a 403
 * carrying DEMO_READ_ONLY_CODE so the UI can explain why. Fail-closed by
 * default for any future admin route too.
 */
export async function requireAdminSession(): Promise<SessionGuardResult> {
  const result = await requireSession();
  if ("error" in result) return result;

  const { role } = result.session.user;
  if (canMutateAdmin(role)) return result;

  if (role === "demo-admin") {
    return {
      error: Response.json({ error: DEMO_READ_ONLY_MESSAGE, code: DEMO_READ_ONLY_CODE }, { status: 403 }),
    };
  }
  return { error: Response.json({ error: "Forbidden" }, { status: 403 }) };
}
