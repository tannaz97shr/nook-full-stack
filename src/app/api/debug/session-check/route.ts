import { requireSession } from "@/modules/auth/lib/requireSession";

/**
 * QA-only route to exercise requireSession() directly — Phase 3 has no
 * real protected API routes yet (those land in Phase 5). Delete once one
 * exists to exercise instead.
 */
export async function GET() {
  const guard = await requireSession();
  if ("error" in guard) return guard.error;
  return Response.json({ user: guard.session.user });
}
