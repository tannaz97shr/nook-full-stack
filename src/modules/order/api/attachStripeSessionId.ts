import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/shared/lib/firebase-admin";
import { ORDER_COLLECTIONS } from "../lib/collections";

/** Links a successfully-created Stripe Checkout Session back to its order. */
export async function attachStripeSessionId(orderId: string, stripeSessionId: string): Promise<void> {
  await adminDb.collection(ORDER_COLLECTIONS.orders).doc(orderId).update({
    stripeSessionId,
    updatedAt: FieldValue.serverTimestamp(),
  });
}
