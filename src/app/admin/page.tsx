import { redirect } from "next/navigation";
import { ROUTES } from "@/shared/routes";

/**
 * No admin dashboard exists yet. Long-term this should redirect to
 * /admin/orders (see ROUTES.admin's comment) once Phase 6b builds the
 * order queue. For now /admin/menu is the only real section, so redirect
 * there instead.
 */
export default function AdminPage() {
  redirect(ROUTES.admin.menu);
}
