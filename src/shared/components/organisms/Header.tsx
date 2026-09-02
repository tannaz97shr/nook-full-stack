import Link from "next/link";
import { CartTrigger } from "@/modules/cart/components/CartTrigger";
import { ROUTES } from "@/shared/routes";
import { ThemeToggle } from "../molecules/ThemeToggle";

export interface HeaderProps {
  userId: string | null;
}

// Deliberately minimal — only Home/Menu are real routes this phase.
// Gallery/About/Contact land in Phase 7 and get added here then.
export function Header({ userId }: HeaderProps) {
  const accountHref = userId ? ROUTES.account.root : ROUTES.signIn;
  const accountLabel = userId ? "Account" : "Sign in";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link href={ROUTES.home} className="flex items-center gap-2 font-display text-xl text-ink">
          <span className="h-2 w-2 rounded-pill bg-gold" />
          Nook
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-muted sm:flex">
          <Link href={ROUTES.home} className="hover:text-ink">
            Home
          </Link>
          <Link href={ROUTES.menu} className="hover:text-ink">
            Menu
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href={accountHref}
            className="hidden text-sm font-semibold text-ink-muted hover:text-ink sm:inline"
          >
            {accountLabel}
          </Link>
          <CartTrigger />
        </div>
      </div>
    </header>
  );
}
