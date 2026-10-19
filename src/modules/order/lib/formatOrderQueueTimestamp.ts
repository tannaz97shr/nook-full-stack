import { formatCafeDayMonth, formatCafeTime, isSameCafeDay } from "@/shared/utils/date";

/** "8:04am" for today's orders, "5 Sep, 7:58am" for older ones — in Melbourne time, since this renders on UTC servers. The queue has no per-shift scoping. */
export function formatOrderQueueTimestamp(createdAt: number, now: Date = new Date()): string {
  const date = new Date(createdAt);
  const time = formatCafeTime(date);
  return isSameCafeDay(date, now) ? time : `${formatCafeDayMonth(date)}, ${time}`;
}
