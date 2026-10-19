import type { ReactNode } from "react";
import { auth } from "@/auth";
import { CartDrawer } from "@/modules/cart/components/CartDrawer";
import { canViewAdmin } from "@/modules/auth/lib/roles";
import { Footer } from "../organisms/Footer";
import { Header } from "../organisms/Header";

/**
 * Public-site chrome: header, footer and cart drawer. Used by the (site)
 * route group's layout and by the root not-found page, which Next renders
 * outside every route group, so both show the same chrome.
 *
 * Server-only (reads the session), so it is deliberately not exported from
 * the shared components barrel, which client components import.
 */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  // Only decides whether the mobile nav shows an Admin link — /admin and
  // /api/admin/* still gate themselves (requireAdminSession).
  const isAdmin = canViewAdmin(session?.user?.role);

  return (
    <>
      <Header userId={userId} isAdmin={isAdmin} />
      {children}
      <Footer />
      <CartDrawer />
    </>
  );
}
