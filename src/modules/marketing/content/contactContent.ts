import { CLOSED_LABEL, formatHoursRange, OPENING_HOURS_ROWS } from "@/shared/content/opening-hours";

export const CONTACT_HEADER = {
  heading: "Come find us",
  body: "No bookings, no fuss — just turn up. If the two tables out front are free, they're yours.",
};

export const CONTACT_HOURS: {
  rows: { label: string; value: string; muted?: boolean }[];
  badge: string;
} = {
  rows: [
    ...OPENING_HOURS_ROWS.map((row) => ({
      label: row.longLabel,
      value: formatHoursRange(row.hours, " – "),
    })),
    { label: "Public holidays", value: CLOSED_LABEL, muted: true },
  ],
  badge: "Kitchen closes 15:30",
};

export const CONTACT_ADDRESS = {
  lines: ["41 Ashgrove Lane", "Carlton North, VIC 3054"],
  gettingHere:
    "Tram 96 to Stop 22, then a two-minute walk. Two-hour street parking on Ashgrove Lane, free after 10am.",
};

export const CONTACT_LINKS = [
  { label: "hello@nook.cafe", href: "mailto:hello@nook.cafe" },
  { label: "(03) 9041 8827", href: "tel:+61390418827" },
  { label: "@nook.carltonnorth", href: "https://instagram.com/nook.carltonnorth" },
];

export const CONTACT_MAP_PLACEHOLDER = {
  eyebrow: "Map embed",
  title: "41 Ashgrove Lane",
  note: "We haven't wired up a live map yet — search the address above in your maps app of choice.",
  linkLabel: "Open in Maps ↗",
  linkHref: "https://www.google.com/maps/search/?api=1&query=41+Ashgrove+Lane,+Carlton+North+VIC+3054",
};

export const CONTACT_PHOTO = {
  src: "/images/marketing/interior-garden-view.jpg",
  alt: "The back table, by the garden window",
};
