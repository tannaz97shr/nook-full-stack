import {
  CAFE_TIMEZONE,
  CLOSING_SOON_THRESHOLD_MINUTES,
  OPENING_HOURS,
  isPublicHoliday,
} from "@/shared/content/opening-hours";
import type { Weekday } from "@/shared/content/opening-hours";
import type { OpenStatus } from "../types/open-status";

const WEEKDAY_INDEX: Record<string, Weekday> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

// en-US for stable short weekday names; hourCycle h23 so midnight is "00", never "24".
const cafeClock = new Intl.DateTimeFormat("en-US", {
  timeZone: CAFE_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const DAY_MS = 24 * 60 * 60 * 1000;

/** Melbourne calendar date, weekday, and minutes since midnight — never server-local or UTC. */
function toCafeTime(now: Date): { isoDate: string; weekday: Weekday; minutes: number } {
  const parts = Object.fromEntries(cafeClock.formatToParts(now).map((part) => [part.type, part.value]));
  return {
    isoDate: `${parts.year}-${parts.month}-${parts.day}`,
    weekday: WEEKDAY_INDEX[parts.weekday],
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

/**
 * Pure calendar arithmetic on a "YYYY-MM-DD" — anchored at UTC noon so it's
 * never affected by any timezone's DST transitions.
 */
function addDays(isoDate: string, days: number): string {
  return new Date(Date.parse(`${isoDate}T12:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

export function getOpenStatus(now: Date): OpenStatus {
  const { isoDate, weekday, minutes } = toCafeTime(now);

  if (isPublicHoliday(isoDate)) {
    return { kind: "public-holiday" };
  }

  const today = OPENING_HOURS[weekday];

  if (today && minutes < today.opens) {
    return { kind: "before-open", opensAt: today.opens };
  }

  if (today && minutes < today.closes) {
    return today.closes - minutes <= CLOSING_SOON_THRESHOLD_MINUTES
      ? { kind: "closing-soon", closesAt: today.closes }
      : { kind: "open", closesAt: today.closes };
  }

  // Look a fortnight ahead so a run of holidays (e.g. Christmas/Boxing Day
  // plus additional days) still finds the next trading day.
  for (let daysAhead = 1; daysAhead <= 14; daysAhead++) {
    const nextWeekday = ((weekday + daysAhead) % 7) as Weekday;
    const hours = OPENING_HOURS[nextWeekday];
    if (hours && !isPublicHoliday(addDays(isoDate, daysAhead))) {
      return { kind: "closed", next: { daysAhead, weekday: nextWeekday, opensAt: hours.opens } };
    }
  }

  return { kind: "closed", next: null };
}
