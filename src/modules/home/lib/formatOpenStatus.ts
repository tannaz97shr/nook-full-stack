import { OPEN_STATUS_COPY } from "../content/homeContent";
import type { OpenStatus } from "../types/open-status";

export function formatOpenStatus(status: OpenStatus): string {
  switch (status.kind) {
    case "open":
      return OPEN_STATUS_COPY.open(status.closesAt);
    case "closing-soon":
      return OPEN_STATUS_COPY.closingSoon(status.closesAt);
    case "before-open":
      return OPEN_STATUS_COPY.beforeOpen(status.opensAt);
    case "closed":
      return status.next
        ? OPEN_STATUS_COPY.closed(status.next.daysAhead, status.next.weekday, status.next.opensAt)
        : OPEN_STATUS_COPY.closedNoHours;
  }
}

/** Open and closing-soon get the gold treatment; before-open and closed are muted. */
export function isOpenNow(status: OpenStatus): boolean {
  return status.kind === "open" || status.kind === "closing-soon";
}
