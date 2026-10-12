import type { Role } from "@/modules/auth/types/user";
import type { Order } from "../types/order";

/**
 * The real admin never sees portfolio demo orders, so they can't clutter
 * the queue or stats. The read-only demo-admin sees everything, so a
 * visitor can check out as the demo customer and then watch the order
 * arrive in the queue. Filtered in code, not with a Firestore where():
 * older orders have no isDemo field and would be dropped by
 * where("isDemo", "==", false).
 */
export function filterOrdersForAdminView(orders: Order[], role: Role): Order[] {
  if (role === "demo-admin") return orders;
  return orders.filter((order) => !order.isDemo);
}
