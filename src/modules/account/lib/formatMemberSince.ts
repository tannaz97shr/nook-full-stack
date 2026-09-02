const MEMBER_SINCE_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

/** 1710000000000 -> "Member since March 2024". */
export function formatMemberSince(createdAt: number): string {
  return `Member since ${MEMBER_SINCE_FORMATTER.format(new Date(createdAt))}`;
}
