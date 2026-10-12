import { ROUTES } from "@/shared/routes";

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: "orders", label: "Orders", href: ROUTES.admin.orders },
  { id: "menu", label: "Menu", href: ROUTES.admin.menu },
  { id: "loyalty", label: "Loyalty", href: ROUTES.admin.loyalty },
];

export const ADMIN_BACK_TO_SITE_LABEL = "← Back to site";
/** Compact small-screen version of ADMIN_BACK_TO_SITE_LABEL. */
export const ADMIN_EXIT_LABEL = "Exit";
export const ADMIN_BRAND_LABEL = "Nook";
export const ADMIN_STAFF_LABEL = "STAFF";

/** Shown to the read-only demo-admin role; every admin write is refused server-side. */
export const ADMIN_DEMO_BADGE_LABEL = "Demo · read-only";
export const ADMIN_DEMO_BADGE_TITLE = "Portfolio demo: you can look at everything, but changes are disabled.";
