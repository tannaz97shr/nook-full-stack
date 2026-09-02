import { adminDb } from "@/shared/lib/firebase-admin";
import { ORDER_COLLECTIONS } from "../lib/collections";
import { toOrder } from "../lib/toOrder";
import type { Order } from "../types/order";

/** Server-only. All orders for a signed-in user, newest first. No pagination — see specs/known-issues.md. */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const snapshot = await adminDb
    .collection(ORDER_COLLECTIONS.orders)
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(toOrder);
}
