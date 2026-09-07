import { adminDb } from "@/shared/lib/firebase-admin";
import { ORDER_COLLECTIONS } from "../lib/collections";
import { toOrder } from "../lib/toOrder";
import type { Order } from "../types/order";

/** Server-only. Every order, newest first, for the admin queue. No pagination — see specs/known-issues.md. */
export async function getAllOrders(): Promise<Order[]> {
  const snapshot = await adminDb.collection(ORDER_COLLECTIONS.orders).orderBy("createdAt", "desc").get();
  return snapshot.docs.map(toOrder);
}
