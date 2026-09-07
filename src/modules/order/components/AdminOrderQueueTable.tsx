"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/shared/components";
import { useToast } from "@/shared/hooks/useToast";
import {
  ADMIN_ORDER_QUEUE_COLUMNS,
  ADMIN_ORDER_QUEUE_EMPTY_COPY,
  ORDER_STATUS_ADVANCE_ERROR,
  adminOrderStatusChipVariant,
} from "../content/adminOrderQueueContent";
import { FULFILLMENT_STATUS_STEPS } from "../content/orderStatusContent";
import { useOrderStatusAdvance } from "../hooks/useOrderStatusAdvance";
import type { AdminOrderQueueRow } from "../lib/toAdminOrderQueueRow";
import type { FulfillmentStatus } from "../types/order";

export interface AdminOrderQueueTableProps {
  rows: AdminOrderQueueRow[];
}

function nextStatus(status: FulfillmentStatus | null): FulfillmentStatus | null {
  const currentIndex = FULFILLMENT_STATUS_STEPS.findIndex((step) => step.status === status);
  const next = FULFILLMENT_STATUS_STEPS[currentIndex + 1];
  return next ? next.status : null;
}

/** The status-advance button: optimistic local flip with rollback+toast on error, mirroring AdminItemsTable's 86-toggle. */
export function AdminOrderQueueTable({ rows }: AdminOrderQueueTableProps) {
  const [localRows, setLocalRows] = useState(rows);
  const { showToast } = useToast();
  const advance = useOrderStatusAdvance();
  const router = useRouter();

  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  function handleAdvance(row: AdminOrderQueueRow, target: FulfillmentStatus) {
    setLocalRows((current) =>
      current.map((existing) => (existing.id === row.id ? { ...existing, fulfillmentStatus: target } : existing)),
    );
    advance.mutate(
      { orderId: row.id, status: target },
      {
        onSuccess: () => router.refresh(), // stat tiles are server-computed, so they need a fresh RSC pass too
        onError: () => {
          setLocalRows((current) =>
            current.map((existing) =>
              existing.id === row.id ? { ...existing, fulfillmentStatus: row.fulfillmentStatus } : existing,
            ),
          );
          showToast(ORDER_STATUS_ADVANCE_ERROR, "error");
        },
      },
    );
  }

  if (localRows.length === 0) {
    return <p className="rounded-md border border-border bg-admin-panel p-5 text-[13px] text-ink-subtle">{ADMIN_ORDER_QUEUE_EMPTY_COPY}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border bg-admin-panel">
      <div className="grid min-w-[660px] grid-cols-[1.1fr_1.9fr_0.6fr_1.5fr] gap-3.5 border-b border-border bg-admin-row px-[17px] py-[11px] font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-subtle">
        {ADMIN_ORDER_QUEUE_COLUMNS.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {localRows.map((row) => {
        const next = nextStatus(row.fulfillmentStatus);
        return (
          <div
            key={row.id}
            className={`grid min-w-[660px] grid-cols-[1.1fr_1.9fr_0.6fr_1.5fr] items-center gap-3.5 border-b border-border px-[17px] py-3 last:border-b-0 ${
              row.fulfillmentStatus === "Completed" ? "opacity-60" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="font-mono text-[13.5px] font-medium text-ink">{row.displayId}</div>
              <div className="mt-0.5 text-[12.5px] text-ink-subtle">
                {row.customerLabel} · {row.timeLabel}
              </div>
            </div>
            <div className="min-w-0 text-[13.5px] leading-snug text-ink-muted">{row.itemsSummary}</div>
            <div className="font-mono text-[13.5px] text-ink">{row.totalLabel}</div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant={adminOrderStatusChipVariant(row.fulfillmentStatus)}>{row.fulfillmentStatus ?? "—"}</Badge>
              {next && (
                <button
                  type="button"
                  onClick={() => handleAdvance(row, next)}
                  disabled={advance.isPending}
                  className="rounded-pill border border-border-strong px-3 py-[5px] text-[11.5px] font-semibold text-ink-muted hover:bg-sunken disabled:opacity-50"
                >
                  → {next}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
