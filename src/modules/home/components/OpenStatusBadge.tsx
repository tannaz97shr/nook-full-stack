"use client";

import { useEffect, useState } from "react";
import { formatOpenStatus, isOpenNow } from "../lib/formatOpenStatus";
import { getOpenStatus } from "../lib/getOpenStatus";
import type { OpenStatus } from "../types/open-status";

const REFRESH_INTERVAL_MS = 60_000;

export interface OpenStatusBadgeProps {
  /** Computed by the server for this request. The first client render reuses it, so hydration matches. */
  initialStatus: OpenStatus;
}

/**
 * Recomputes on mount (in case the HTML was served from a cache) and then
 * once a minute, so a tab left open across closing time stays accurate.
 */
export function OpenStatusBadge({ initialStatus }: OpenStatusBadgeProps) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    const refresh = () => setStatus(getOpenStatus(new Date()));
    refresh();
    const intervalId = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const open = isOpenNow(status);

  return (
    <p
      role="status"
      className={`inline-flex items-center gap-2 rounded-pill py-1.5 pl-2.5 pr-3.5 text-sm font-semibold ${
        open ? "bg-gold-soft text-gold" : "bg-sunken text-ink-subtle"
      }`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-pill ${open ? "bg-gold" : "bg-ink-subtle"}`} />
      {formatOpenStatus(status)}
    </p>
  );
}
