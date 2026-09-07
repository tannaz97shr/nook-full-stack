const TIME_FORMATTER = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

/** "8:04am" for today's orders, "Sep 5, 7:58am" for older ones — the queue has no per-shift scoping. */
export function formatOrderQueueTimestamp(createdAt: number): string {
  const date = new Date(createdAt);
  const isToday = new Date().toDateString() === date.toDateString();
  const time = TIME_FORMATTER.format(date).replace(" ", "").toLowerCase();
  return isToday ? time : `${DATE_FORMATTER.format(date)}, ${time}`;
}
