import {
  CAFE_TIMEZONE,
  CLOSING_SOON_THRESHOLD_MINUTES,
  OPENING_HOURS,
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
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Weekday + minutes since midnight in the cafe's timezone — never server-local or UTC. */
function toCafeTime(now: Date): { weekday: Weekday; minutes: number } {
  const parts = Object.fromEntries(cafeClock.formatToParts(now).map((part) => [part.type, part.value]));
  return {
    weekday: WEEKDAY_INDEX[parts.weekday],
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

export function getOpenStatus(now: Date): OpenStatus {
  const { weekday, minutes } = toCafeTime(now);
  const today = OPENING_HOURS[weekday];

  if (today && minutes < today.opens) {
    return { kind: "before-open", opensAt: today.opens };
  }

  if (today && minutes < today.closes) {
    return today.closes - minutes <= CLOSING_SOON_THRESHOLD_MINUTES
      ? { kind: "closing-soon", closesAt: today.closes }
      : { kind: "open", closesAt: today.closes };
  }

  for (let daysAhead = 1; daysAhead <= 7; daysAhead++) {
    const nextWeekday = ((weekday + daysAhead) % 7) as Weekday;
    const hours = OPENING_HOURS[nextWeekday];
    if (hours) {
      return { kind: "closed", next: { daysAhead, weekday: nextWeekday, opensAt: hours.opens } };
    }
  }

  return { kind: "closed", next: null };
}
