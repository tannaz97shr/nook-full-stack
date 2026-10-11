import { toCents } from "@/modules/order/lib/gst";
import type { Order } from "@/modules/order/types/order";

/**
 * $1 spent = 1 point, on the amount actually paid (order.total, after any
 * reward) — GST-inclusive, matching the prices the customer sees, and
 * reward-funded value doesn't itself earn points. Legacy tax-added orders
 * keep their original rule (pre-tax subtotal) so completing one placed
 * before GST-inclusive pricing credits exactly what it always would have.
 */
export function pointsForOrder(order: Pick<Order, "pricing" | "subtotal" | "total">): number {
  if (order.pricing.kind === "legacy-tax-added") {
    return Math.floor(order.subtotal);
  }
  return Math.floor(toCents(order.total) / 100);
}
