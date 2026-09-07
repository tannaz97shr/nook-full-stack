import { ADMIN_MENU_TABS } from "../content/adminMenuContent";
import type { AdminMenuTabId } from "../content/adminMenuContent";

export interface AdminMenuTabsProps {
  activeTab: AdminMenuTabId;
  onSelect: (tab: AdminMenuTabId) => void;
}

export function AdminMenuTabs({ activeTab, onSelect }: AdminMenuTabsProps) {
  return (
    <div className="flex flex-wrap gap-[7px]">
      {ADMIN_MENU_TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            className={`rounded-pill px-4 py-2 text-[13.5px] font-semibold ${
              isActive ? "bg-ink text-bg" : "border border-border-strong text-ink-muted hover:bg-sunken"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
