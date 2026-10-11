import Link from "next/link";
import { CartTrigger } from "@/modules/cart/components/CartTrigger";
import { AUTH_NAV_LABELS, NAV_LINKS } from "@/shared/content/nav-content";
import { ROUTES } from "@/shared/routes";
import { ThemeToggle } from "../molecules/ThemeToggle";
import { MobileNav } from "./MobileNav";

export interface HeaderProps {
  userId: string | null;
  isAdmin: boolean;
}

export function Header({ userId, isAdmin }: HeaderProps) {
  const accountHref = userId ? ROUTES.account.root : ROUTES.signIn;
  const accountLabel = userId ? AUTH_NAV_LABELS.account : AUTH_NAV_LABELS.signIn;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link href={ROUTES.home} className="flex items-center gap-2 font-display text-xl text-ink">
          <span className="h-2 w-2 rounded-pill bg-gold" />
          Nook
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-muted md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
        {/* gap-2 below md: logo + toggle + cart + menu button must fit in 320px. */}
        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <Link
            href={accountHref}
            className="hidden text-sm font-semibold text-ink-muted hover:text-ink md:inline"
          >
            {accountLabel}
          </Link>
          <CartTrigger />
          <MobileNav isSignedIn={userId !== null} isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  );
}
