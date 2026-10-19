import type { ReactNode } from "react";
import { SiteChrome } from "@/shared/components/templates/SiteChrome";

/**
 * Public-site chrome. Lives in the (site) route group rather than the root
 * layout so /admin can own the whole page with its own shell — the public
 * header and footer used to render above/below AdminShell's fixed sidebar
 * and cover parts of it.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
