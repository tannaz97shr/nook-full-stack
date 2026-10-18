import type { Weekday } from "@/shared/content/opening-hours";

export const HOME_METADATA = {
  title: "Nook — Coffee & bakery in Carlton North",
  description:
    "Small-batch roasts, pastry baked on site, and a quiet table by the window. Order ahead from Nook, 41 Ashgrove Lane, Carlton North.",
};

export const HOME_HERO = {
  // Non-breaking space: "flat white." must never split across lines.
  heading: { lead: "A quiet corner", accent: "and a proper", tail: "flat white." },
  body: "Small-batch roasts, bread baked out the back, and a table by the window that's usually free before nine. Order ahead and we'll have it waiting.",
  ctaPrimary: "See the menu",
  ctaSecondary: "Find us",
  mainPhoto: {
    src: "/images/marketing/hero-latte-art.jpg",
    alt: "Latte with heart art, steam rising",
  },
  insetPhoto: {
    src: "/images/marketing/brownie-lattes.jpg",
    alt: "Brownie and two lattes",
  },
};

export const HOME_VALUES = {
  heading: "Three things we're stubborn about",
  items: [
    {
      number: "01",
      title: "Roasted eleven days ago, tops",
      body: "We take one 12kg drop a week from a roaster four suburbs over. Whatever's left on Sunday goes home with staff.",
    },
    {
      number: "02",
      title: "The pastry case is baked here",
      body: "Laminated dough on Tuesdays and Fridays, so the croissants are gone by eleven. We're not sorry, but we are aware.",
    },
    {
      number: "03",
      title: "No music loud enough to shout over",
      body: "Wifi's on the receipt. Stay as long as you like — we'd rather a full room than a fast one.",
    },
  ],
};

export const HOME_FEATURED = {
  eyebrow: "Popular this week",
  heading: "What people keep ordering",
  cta: "Full menu →",
  loadError: "We couldn't load this week's favourites just now — the full menu has everything.",
};

export const HOME_REWARDS = {
  heading: { lead: "Earn a free coffee", tail: "roughly every ninth visit" },
  body: "A point per dollar, no card to lose. Sign in before you order and it tracks itself.",
  ctaSignedOut: "Join rewards",
  ctaSignedIn: "View my points",
  photo: {
    src: "/images/marketing/interior-tables.jpg",
    alt: "Empty tables in the cafe, bathed in soft window light",
  },
};

const WEEKDAY_NAMES: Record<Weekday, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

/** 960 → "4pm", 450 → "7:30am". */
export function formatBadgeTime(minutes: number): string {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const hours12 = hours24 % 12 || 12;
  const suffix = hours24 < 12 ? "am" : "pm";
  return mins === 0 ? `${hours12}${suffix}` : `${hours12}:${String(mins).padStart(2, "0")}${suffix}`;
}

export const OPEN_STATUS_COPY = {
  alwaysOpen: "Open now · order ahead",
  open: (closesAt: number) => `Open today until ${formatBadgeTime(closesAt)}`,
  closingSoon: (closesAt: number) => `Closing at ${formatBadgeTime(closesAt)}`,
  beforeOpen: (opensAt: number) => `Opens at ${formatBadgeTime(opensAt)}`,
  closed: (daysAhead: number, weekday: Weekday, opensAt: number) =>
    `Closed · opens ${daysAhead === 1 ? "tomorrow" : WEEKDAY_NAMES[weekday]} ${formatBadgeTime(opensAt)}`,
  closedNoHours: "Closed",
  publicHoliday: "Closed today · public holiday",
};
