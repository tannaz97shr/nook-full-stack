import { CAFE_TIMEZONE } from "@/shared/content/opening-hours";

/**
 * Every date or time the UI shows goes through here, pinned to the cafe's
 * timezone. Never format a Date without a `timeZone`: Vercel's servers run on
 * UTC, so an unpinned formatter shows 5:48pm Melbourne time as "6:48am".
 * Intl applies AEDT/AEST (daylight saving) on its own.
 */
const LOCALE = "en-AU";

const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: CAFE_TIMEZONE,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const dayMonthFormatter = new Intl.DateTimeFormat(LOCALE, { timeZone: CAFE_TIMEZONE, day: "numeric", month: "short" });

const dayMonthYearFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: CAFE_TIMEZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
});

const monthYearFormatter = new Intl.DateTimeFormat(LOCALE, { timeZone: CAFE_TIMEZONE, month: "long", year: "numeric" });

const calendarDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: CAFE_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "5:48pm". Built from parts so the separator before am/pm (a space or a narrow no-break space, depending on the ICU version) never leaks through. */
export function formatCafeTime(date: Date): string {
  const parts = timeFormatter.formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("hour")}:${value("minute")}${value("dayPeriod").replace(/\./g, "").toLowerCase()}`;
}

/** "19 Oct" */
export function formatCafeDayMonth(date: Date): string {
  return dayMonthFormatter.format(date);
}

/** "19 Oct 2026" */
export function formatCafeDate(date: Date): string {
  return dayMonthYearFormatter.format(date);
}

/** "October 2026" */
export function formatCafeMonthYear(date: Date): string {
  return monthYearFormatter.format(date);
}

/** "2026-10-19" — the Melbourne calendar date, for same-day comparisons. */
export function toCafeCalendarDate(date: Date): string {
  return calendarDateFormatter.format(date);
}

export function isSameCafeDay(a: Date, b: Date): boolean {
  return toCafeCalendarDate(a) === toCafeCalendarDate(b);
}

/** The Melbourne calendar year — use instead of getFullYear(), which reads the server's (UTC) clock. */
export function toCafeYear(date: Date): number {
  return Number(toCafeCalendarDate(date).slice(0, 4));
}
