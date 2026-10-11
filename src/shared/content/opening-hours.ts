/**
 * Single source of truth for trading hours — the footer, the contact page,
 * and the homepage open/closed badge all read from here. Times are minutes
 * since midnight in CAFE_TIMEZONE, never server-local or UTC.
 */
export const CAFE_TIMEZONE = "Australia/Melbourne";

/** The homepage badge switches from "Open today until X" to "Closing at X" inside this window. */
export const CLOSING_SOON_THRESHOLD_MINUTES = 30;

/** 0 = Sunday … 6 = Saturday, matching Date#getDay(). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface TradingHours {
  opens: number;
  closes: number;
}

/** `null` = closed all day. Public holidays aren't modeled (see specs/known-issues.md). */
export const OPENING_HOURS: Record<Weekday, TradingHours | null> = {
  0: { opens: 8 * 60, closes: 14 * 60 },
  1: { opens: 7 * 60, closes: 16 * 60 },
  2: { opens: 7 * 60, closes: 16 * 60 },
  3: { opens: 7 * 60, closes: 16 * 60 },
  4: { opens: 7 * 60, closes: 16 * 60 },
  5: { opens: 7 * 60, closes: 16 * 60 },
  6: { opens: 8 * 60, closes: 15 * 60 },
};

export interface OpeningHoursRow {
  shortLabel: string;
  longLabel: string;
  hours: TradingHours | null;
}

/** Grouped display rows. Times come from OPENING_HOURS via each group's first day. */
const ROW_GROUPS: { days: Weekday[]; shortLabel: string; longLabel: string }[] = [
  { days: [1, 2, 3, 4, 5], shortLabel: "Mon–Fri", longLabel: "Monday – Friday" },
  { days: [6], shortLabel: "Sat", longLabel: "Saturday" },
  { days: [0], shortLabel: "Sun", longLabel: "Sunday" },
];

export const OPENING_HOURS_ROWS: OpeningHoursRow[] = ROW_GROUPS.map(
  ({ days, shortLabel, longLabel }) => ({ shortLabel, longLabel, hours: OPENING_HOURS[days[0]] }),
);

/** 420 → "7:00", 930 → "15:30". */
export function formatClockTime(minutes: number): string {
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;
}

export const CLOSED_LABEL = "Closed";

export function formatHoursRange(hours: TradingHours | null, separator: string): string {
  return hours
    ? `${formatClockTime(hours.opens)}${separator}${formatClockTime(hours.closes)}`
    : CLOSED_LABEL;
}
