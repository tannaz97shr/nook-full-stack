import type { ReactNode } from "react";
import { auth } from "@/auth";
import { Footer, Header } from "@/shared/components";
import { CartDrawer } from "@/modules/cart/components/CartDrawer";
import { canViewAdmin } from "@/modules/auth/lib/roles";

/**
 * Public-site chrome. Lives in the (site) route group rather than the root
 * layout so /admin can own the whole page with its own shell — the public
 * header and footer used to render above/below AdminShell's fixed sidebar
 * and cover parts of it.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
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
