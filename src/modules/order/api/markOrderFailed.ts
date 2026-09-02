import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/shared/lib/firebase-admin";
import { ORDER_COLLECTIONS } from "../lib/collections";

/** Marks an order Failed when Stripe Checkout Session creation itself throws — never leaves it orphaned as Pending. */
export async function markOrderFailed(orderId: string): Promise<void> {
  await adminDb.collection(ORDER_COLLECTIONS.orders).doc(orderId).update({
    paymentStatus: "Failed",
    updatedAt: FieldValue.serverTimestamp(),
  });
}
