import { ROUTES } from "@/shared/routes";

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
}

/**
 * Only Menu is a real section this phase — Orders/Loyalty land in 6b/6c.
 * Linking to those routes now would 404 since no page.tsx exists yet for
 * them; append their entries here once each phase builds its route.
 */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [{ id: "menu", label: "Menu", href: ROUTES.admin.menu }];

export const ADMIN_BACK_TO_SITE_LABEL = "← Back to site";
export const ADMIN_BRAND_LABEL = "Nook";
export const ADMIN_STAFF_LABEL = "STAFF";
