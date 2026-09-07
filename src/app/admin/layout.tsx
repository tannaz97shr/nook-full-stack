import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireSession } from "@/modules/auth/lib/requireSession";
import { AdminShell } from "@/modules/admin/components/AdminShell";
import { ROUTES, signInWithCallback } from "@/shared/routes";

/**
 * Defense-in-depth alongside middleware.ts, which already redirects /admin
 * both when unauthenticated and when authenticated-but-non-admin — this
 * layout makes the same two checks server-side (CLAUDE.md: never rely on
 * a page-level layout gate alone, so every /admin/api route below still
 * self-checks requireAdminSession() independently).
 *
 * Uses requireSession() rather than requireAdminSession(): the latter
 * collapses 401-vs-403 into one JSON-shaped {error: Response}, which is
 * right for an API route but wrong here — a page needs two different
 * redirect targets, not a JSON body.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const guard = await requireSession();
  if ("error" in guard) {
    redirect(signInWithCallback(ROUTES.admin.root));
  }
  if (guard.session.user.role !== "admin") {
    redirect(ROUTES.home);
  }

  return (
    <div className="min-h-screen bg-admin-bg">
      <AdminShell user={guard.session.user} />
      <main className="p-4 sm:p-7 lg:pl-60">{children}</main>
    </div>
  );
}
