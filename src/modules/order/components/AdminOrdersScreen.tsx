"use client";

import { useMemo, useState } from "react";
import {
  ADMIN_ORDER_QUEUE_HEADING,
  ADMIN_ORDER_QUEUE_SUBHEADING,
  ADMIN_ORDER_QUEUE_TABS,
  ADMIN_ORDER_STAT_LABELS,
  type AdminOrderQueueTabId,
} from "../content/adminOrderQueueContent";
import { AdminOrderQueueTable } from "./AdminOrderQueueTable";
import type { AdminOrderStats } from "../lib/computeAdminOrderStats";
import type { AdminOrderQueueRow } from "../lib/toAdminOrderQueueRow";

export interface AdminOrdersScreenProps {
  rows: AdminOrderQueueRow[];
  stats: AdminOrderStats;
}

/** Only Paid orders are actionable for fulfillment — nothing to fulfill on a Pending/Failed/Cancelled order. */
export function AdminOrdersScreen({ rows, stats }: AdminOrdersScreenProps) {
  const [activeTab, setActiveTab] = useState<AdminOrderQueueTabId>("all");

  const paidRows = useMemo(() => rows.filter((row) => row.paymentStatus === "Paid"), [rows]);
  const visibleRows = useMemo(
    () => (activeTab === "all" ? paidRows : paidRows.filter((row) => row.fulfillmentStatus === activeTab)),
    [paidRows, activeTab],
  );

  const statTiles = [
    { label: ADMIN_ORDER_STAT_LABELS.inQueue, value: String(stats.inQueueCount) },
    { label: ADMIN_ORDER_STAT_LABELS.readyForPickup, value: String(stats.readyForPickupCount) },
    { label: ADMIN_ORDER_STAT_LABELS.doneToday, value: stats.doneTodayLabel },
    { label: ADMIN_ORDER_STAT_LABELS.takings, value: stats.takingsTodayLabel },
  ];

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="font-display text-2xl text-ink">{ADMIN_ORDER_QUEUE_HEADING}</h1>
        <p className="text-[13px] text-ink-subtle">{ADMIN_ORDER_QUEUE_SUBHEADING}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statTiles.map((tile) => (
          <div key={tile.label} className="rounded-md border border-border bg-admin-panel px-[17px] py-[15px]">
            <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-subtle">{tile.label}</div>
            <div className="font-mono text-[26px] font-medium leading-none text-ink">{tile.value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-[7px]">
        {ADMIN_ORDER_QUEUE_TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-pill px-4 py-2 text-[13.5px] font-semibold ${
                isActive ? "bg-ink text-bg" : "border border-border-strong text-ink-muted hover:bg-sunken"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <AdminOrderQueueTable rows={visibleRows} />
    </div>
  );
}
