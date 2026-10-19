import { formatCafeMonthYear } from "@/shared/utils/date";

/** 1710000000000 -> "Member since March 2024". */
export function formatMemberSince(createdAt: number): string {
  return `Member since ${formatCafeMonthYear(new Date(createdAt))}`;
}
