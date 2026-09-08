import Link from "next/link";
import { ROUTES } from "@/shared/routes";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <Link href={ROUTES.home} className="flex items-center gap-2 font-display text-xl text-ink">
            <span className="h-2 w-2 rounded-pill bg-gold" />
            Nook
          </Link>
          <p className="mt-3 text-sm text-ink-muted">41 Ashgrove Lane</p>
          <p className="text-sm text-ink-muted">Carlton North VIC 3054</p>
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-ink-subtle">Visit</h2>
          <p className="mt-3 text-sm text-ink-muted">Mon–Fri 7:00–16:00</p>
          <p className="text-sm text-ink-muted">Sat 8:00–15:00</p>
          <p className="text-sm text-ink-muted">Sun 8:00–14:00</p>
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-ink-subtle">Site</h2>
          <nav className="mt-3 flex flex-col gap-2 text-sm">
            <Link href={ROUTES.home} className="text-ink-muted hover:text-ink">
              Home
            </Link>
            <Link href={ROUTES.menu} className="text-ink-muted hover:text-ink">
              Menu
            </Link>
            <Link href={ROUTES.gallery} className="text-ink-muted hover:text-ink">
              Gallery
            </Link>
            <Link href={ROUTES.about} className="text-ink-muted hover:text-ink">
              About
            </Link>
            <Link href={ROUTES.contact} className="text-ink-muted hover:text-ink">
              Contact
            </Link>
            <Link href={ROUTES.account.rewards} className="text-ink-muted hover:text-ink">
              Rewards
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-ink-subtle">Elsewhere</h2>
          <nav className="mt-3 flex flex-col gap-2 text-sm">
            <a href="mailto:hello@nook.cafe" className="text-ink-muted hover:text-ink">
              hello@nook.cafe
            </a>
            <a href="tel:+61390418827" className="text-ink-muted hover:text-ink">
              (03) 9041 8827
            </a>
            <a
              href="https://instagram.com/nook.carltonnorth"
              className="text-ink-muted hover:text-ink"
            >
              @nook.carltonnorth
            </a>
          </nav>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-[1240px] px-4 py-6 text-xs text-ink-subtle sm:px-8">
          © {new Date().getFullYear()} Nook Coffee. Made on Wurundjeri land.
        </div>
      </div>
    </footer>
  );
}
