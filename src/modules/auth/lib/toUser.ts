import type { DocumentSnapshot } from "firebase-admin/firestore";
import type { User } from "../types/user";

export function toUser(doc: DocumentSnapshot): User {
  const data = doc.data();
  if (!data) {
    throw new Error(`User document ${doc.id} does not exist`);
  }

  return {
    id: doc.id,
    email: data.email,
    name: data.name,
    phone: data.phone ?? null,
    role: data.role,
    authProvider: data.authProvider,
    pointsBalance: data.pointsBalance ?? 0,
    activeRedemptionOrderId: data.activeRedemptionOrderId ?? null,
    createdAt: data.createdAt?.toMillis() ?? 0,
    updatedAt: data.updatedAt?.toMillis() ?? 0,
  };
}
