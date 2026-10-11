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

/** `null` = closed all day. Public holidays override this — see VIC_PUBLIC_HOLIDAYS. */
export const OPENING_HOURS: Record<Weekday, TradingHours | null> = {
  0: { opens: 8 * 60, closes: 14 * 60 },
  1: { opens: 7 * 60, closes: 16 * 60 },
  2: { opens: 7 * 60, closes: 16 * 60 },
  3: { opens: 7 * 60, closes: 16 * 60 },
  4: { opens: 7 * 60, closes: 16 * 60 },
  5: { opens: 7 * 60, closes: 16 * 60 },
  6: { opens: 8 * 60, closes: 15 * 60 },
};

/**
 * Closed all day on Victorian public holidays (the contact page's "Public
 * holidays: Closed"). Dates are Melbourne-local calendar dates. Source:
 * Business Victoria. Includes Melbourne Cup Day (metro Melbourne) and
 * "additional day" substitutes; Victoria gives no substitute for Anzac Day.
 *
 * Extend before PUBLIC_HOLIDAYS_COVERED_THROUGH runs out (see
 * specs/known-issues.md). AFL Grand Final Friday 2027 is deliberately absent
 * until the AFL confirms the date — a wrong guess would show "Closed" on a
 * real trading day.
 */
export const PUBLIC_HOLIDAYS_COVERED_THROUGH = 2027;

export const VIC_PUBLIC_HOLIDAYS: { date: string; name: string }[] = [
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-01-26", name: "Australia Day" },
  { date: "2026-03-09", name: "Labour Day" },
  { date: "2026-04-03", name: "Good Friday" },
  { date: "2026-04-04", name: "Saturday before Easter Sunday" },
  { date: "2026-04-05", name: "Easter Sunday" },
  { date: "2026-04-06", name: "Easter Monday" },
  { date: "2026-04-25", name: "Anzac Day" },
  { date: "2026-06-08", name: "King's Birthday" },
  { date: "2026-09-25", name: "Friday before the AFL Grand Final" },
  { date: "2026-11-03", name: "Melbourne Cup Day" },
  { date: "2026-12-25", name: "Christmas Day" },
  { date: "2026-12-26", name: "Boxing Day" },
  { date: "2026-12-28", name: "Boxing Day (additional day)" },
  { date: "2027-01-01", name: "New Year's Day" },
  { date: "2027-01-26", name: "Australia Day" },
  { date: "2027-03-08", name: "Labour Day" },
  { date: "2027-03-26", name: "Good Friday" },
  { date: "2027-03-27", name: "Saturday before Easter Sunday" },
  { date: "2027-03-28", name: "Easter Sunday" },
  { date: "2027-03-29", name: "Easter Monday" },
  { date: "2027-04-25", name: "Anzac Day" },
  { date: "2027-06-14", name: "King's Birthday" },
  { date: "2027-11-02", name: "Melbourne Cup Day" },
  { date: "2027-12-25", name: "Christmas Day" },
  { date: "2027-12-26", name: "Boxing Day" },
  { date: "2027-12-27", name: "Christmas Day (additional day)" },
  { date: "2027-12-28", name: "Boxing Day (additional day)" },
];

const PUBLIC_HOLIDAY_DATES = new Set(VIC_PUBLIC_HOLIDAYS.map((holiday) => holiday.date));

/** `isoDate` is a Melbourne-local "YYYY-MM-DD". */
export function isPublicHoliday(isoDate: string): boolean {
  return PUBLIC_HOLIDAY_DATES.has(isoDate);
}

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
