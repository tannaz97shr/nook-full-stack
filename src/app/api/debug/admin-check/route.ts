import { requireAdminSession } from "@/modules/auth/lib/requireAdminSession";

/**
 * QA-only route to exercise requireAdminSession() directly — Phase 3 has
 * no real admin API routes yet (those land in Phase 6). Delete once one
 * exists to exercise instead.
 */
export async function GET() {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;
  return Response.json({ user: guard.session.user });
}
