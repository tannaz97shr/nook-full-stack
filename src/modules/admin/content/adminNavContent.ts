import { ROUTES } from "@/shared/routes";

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
}

/** Loyalty lands in 6c — append its entry here once that phase builds its route. */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: "orders", label: "Orders", href: ROUTES.admin.orders },
  { id: "menu", label: "Menu", href: ROUTES.admin.menu },
];

export const ADMIN_BACK_TO_SITE_LABEL = "← Back to site";
export const ADMIN_BRAND_LABEL = "Nook";
export const ADMIN_STAFF_LABEL = "STAFF";
