import { ROUTES } from "@/shared/routes";

export interface NavLink {
  label: string;
  href: string;
}

/** Main site links — shared by the desktop header row and the mobile nav panel. */
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: ROUTES.home },
  { label: "Menu", href: ROUTES.menu },
  { label: "Gallery", href: ROUTES.gallery },
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
];

export const AUTH_NAV_LABELS = {
  signIn: "Sign in",
  account: "Account",
  admin: "Admin",
};

// "Menu" is avoided for the toggle/panel names — it's already the café
// menu link, and "Open menu" would be ambiguous to a screen reader user.
export const MOBILE_NAV = {
  openLabel: "Open site navigation",
  closeLabel: "Close site navigation",
  title: "Site",
};
