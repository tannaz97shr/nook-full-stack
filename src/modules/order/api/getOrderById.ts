import { adminDb } from "@/shared/lib/firebase-admin";
import { ORDER_COLLECTIONS } from "../lib/collections";
import { toOrder } from "../lib/toOrder";
import type { Order } from "../types/order";

/** Server-only. A single Order by ID, or null if it doesn't exist. */
export async function getOrderById(id: string): Promise<Order | null> {
  const doc = await adminDb.collection(ORDER_COLLECTIONS.orders).doc(id).get();
  return doc.exists ? toOrder(doc) : null;
}
