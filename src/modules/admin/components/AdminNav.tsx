"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "../content/adminNavContent";

/** Active-state nav list, same usePathname()-driven pattern as AccountTabs. */
export function AdminNav() {
  const pathname = usePathname();

  return (
    // Equal thirds on small screens so every link is visible at 375px without scrolling.
    <nav className="grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-[3px]">
      {ADMIN_NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`whitespace-nowrap rounded-pill px-3 py-2 text-center text-[13.5px] lg:text-left font-semibold lg:rounded-md lg:px-3 lg:py-[10px] ${
              isActive
                ? "bg-admin-row text-ink"
                : "border border-border text-ink-subtle hover:bg-admin-row hover:text-ink lg:border-0"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
