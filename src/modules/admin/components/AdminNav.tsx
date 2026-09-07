"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "../content/adminNavContent";

/** Active-state nav list, same usePathname()-driven pattern as AccountTabs. */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto lg:grid lg:gap-[3px] lg:overflow-visible">
      {ADMIN_NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`whitespace-nowrap rounded-pill px-3 py-2 text-[13.5px] font-semibold lg:rounded-md lg:px-3 lg:py-[10px] ${
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
