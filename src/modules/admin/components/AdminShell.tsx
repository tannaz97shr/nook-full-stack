import Link from "next/link";
import { ThemeToggle } from "@/shared/components";
import { ROUTES } from "@/shared/routes";
import type { SessionUser } from "@/modules/auth/types/session-user";
import { ADMIN_BACK_TO_SITE_LABEL, ADMIN_BRAND_LABEL, ADMIN_STAFF_LABEL } from "../content/adminNavContent";
import { AdminNav } from "./AdminNav";

export interface AdminShellProps {
  user: SessionUser;
}

/**
 * Sidebar on large screens (fixed, full-height), collapses to a top bar +
 * horizontal pill nav on small screens — same wideNav/narrowNav split as
 * the design source. A sibling <main> in admin/layout.tsx needs a
 * matching lg:pl-60 offset for the fixed sidebar.
 */
export function AdminShell({ user }: AdminShellProps) {
  return (
    <header className="border-b border-border bg-admin-panel lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:flex-col lg:items-stretch lg:justify-start lg:gap-6 lg:p-4">
        <div className="flex items-center gap-2 px-1">
          <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-sm bg-ink font-display text-base font-semibold text-bg">
            N
          </span>
          <div>
            <div className="text-sm font-bold leading-tight text-ink">{ADMIN_BRAND_LABEL}</div>
            <div className="font-mono text-[10.5px] tracking-wide text-ink-subtle">{ADMIN_STAFF_LABEL}</div>
          </div>
        </div>

        <div className="min-w-0 flex-1 lg:flex-none">
          <AdminNav />
        </div>

        <div className="hidden items-center gap-2 lg:mt-auto lg:flex">
          <ThemeToggle />
          <Link
            href={ROUTES.home}
            className="rounded-md px-3 py-[10px] text-[13.5px] font-semibold text-ink-subtle hover:bg-admin-row hover:text-ink"
          >
            {ADMIN_BACK_TO_SITE_LABEL}
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Link
            href={ROUTES.home}
            className="rounded-pill border border-border px-3 py-2 text-[13px] font-semibold text-ink"
          >
            Exit
          </Link>
        </div>
      </div>

      <span className="sr-only">Signed in as {user.name}</span>
    </header>
  );
}
