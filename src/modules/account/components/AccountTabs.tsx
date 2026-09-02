"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCOUNT_TABS } from "../content/accountContent";

export function AccountTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 overflow-x-auto border-b border-border">
      {ACCOUNT_TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`whitespace-nowrap border-b-2 px-3 py-3 text-[14.5px] font-semibold transition-colors ${
              isActive ? "border-gold text-ink" : "border-transparent text-ink-subtle hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
