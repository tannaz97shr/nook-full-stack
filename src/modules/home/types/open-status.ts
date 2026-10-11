import type { Weekday } from "@/shared/content/opening-hours";

/** Plain-object union so it can cross the server → client component boundary as a prop. */
export type OpenStatus =
  | { kind: "before-open"; opensAt: number }
  | { kind: "open"; closesAt: number }
  | { kind: "closing-soon"; closesAt: number }
  | { kind: "closed"; next: { daysAhead: number; weekday: Weekday; opensAt: number } | null };
