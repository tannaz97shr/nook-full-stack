"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useCart } from "@/modules/cart/hooks/useCart";
import { SIGN_OUT_LABEL } from "@/modules/account/content/accountContent";
import { AUTH_NAV_LABELS, MOBILE_NAV, NAV_LINKS } from "@/shared/content/nav-content";
import { useToast } from "@/shared/hooks/useToast";
import { ROUTES } from "@/shared/routes";
import { logError } from "@/shared/utils/log-error";
import { Drawer } from "../molecules/Drawer";

const PANEL_ID = "mobile-nav";
const TITLE_ID = "mobile-nav-title";
// Matches Tailwind's `md` screen — the toggle is `md:hidden`, so the panel
// must not stay open (with no visible way to reach its opener) past it.
const MD_UP_QUERY = "(min-width: 768px)";

function isCurrentPath(pathname: string, href: string): boolean {
  if (href === ROUTES.home) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const LINK_CLASS =
  "block rounded-lg px-3 py-3 font-display text-2xl text-ink hover:bg-sunken aria-[current=page]:bg-sunken aria-[current=page]:text-gold";

export interface MobileNavProps {
  isSignedIn: boolean;
  isAdmin: boolean;
}

export function MobileNav({ isSignedIn, isAdmin }: MobileNavProps) {
  const pathname = usePathname();
  const { isOpen: isCartOpen, close: closeCart } = useCart();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Never open alongside the cart: derived in the same render so both
  // drawers can't commit open together, and reset so it doesn't pop back
  // open when the cart closes.
  const isOpen = open && !isCartOpen;
  useEffect(() => {
    if (isCartOpen) setOpen(false);
  }, [isCartOpen]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const query = window.matchMedia(MD_UP_QUERY);
    function handleChange(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  function handleOpen() {
    closeCart();
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut({ callbackUrl: ROUTES.home });
    } catch (error) {
      logError(error, "MobileNav.handleSignOut", { level: "error" });
      showToast(MOBILE_NAV.signOutError, "error");
      setIsSigningOut(false);
    }
  }

  function renderLink(href: string, label: string) {
    return (
      <Link
        key={href}
        href={href}
        onClick={handleClose}
        aria-current={isCurrentPath(pathname, href) ? "page" : undefined}
        className={LINK_CLASS}
      >
        {label}
      </Link>
    );
  }

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={handleOpen}
        aria-label={MOBILE_NAV.openLabel}
        aria-expanded={isOpen}
        // Drawer unmounts when closed, so only point at it while it exists.
        aria-controls={isOpen ? PANEL_ID : undefined}
        className="grid h-9 w-9 flex-none place-items-center rounded-pill border border-border text-ink hover:bg-sunken md:hidden"
      >
        <span aria-hidden>☰</span>
      </button>

      <Drawer open={isOpen} onClose={handleClose} labelledBy={TITLE_ID} id={PANEL_ID} returnFocusRef={toggleRef}>
        <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-5">
          <h2
            id={TITLE_ID}
            className="font-mono text-xs uppercase tracking-[0.08em] text-ink-subtle"
          >
            {MOBILE_NAV.title}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label={MOBILE_NAV.closeLabel}
            className="grid h-9 w-9 flex-none place-items-center rounded-pill text-ink hover:bg-sunken"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav aria-labelledby={TITLE_ID}>
            {NAV_LINKS.map((link) => renderLink(link.href, link.label))}
          </nav>

          <div className="mt-4 border-t border-border pt-4">
            {isSignedIn ? (
              <>
                {renderLink(ROUTES.account.root, AUTH_NAV_LABELS.account)}
                {isAdmin && renderLink(ROUTES.admin.root, AUTH_NAV_LABELS.admin)}
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="block w-full rounded-lg px-3 py-3 text-left font-display text-2xl text-ink-muted hover:bg-sunken hover:text-ink disabled:opacity-40"
                >
                  {SIGN_OUT_LABEL}
                </button>
              </>
            ) : (
              renderLink(ROUTES.signIn, AUTH_NAV_LABELS.signIn)
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}
