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
export const ADMIN_BRAND_LABEL = "Nook";
export const ADMIN_STAFF_LABEL = "STAFF";
