import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/shared/lib/firebase-admin";
import { AUTH_COLLECTIONS } from "../lib/collections";
import { toUser } from "../lib/toUser";
import type { User } from "../types/user";

interface UpsertGoogleUserInput {
  email: string;
  name: string;
}

/**
 * Server-only. Finds or creates a users/{email} doc for a Google sign-in.
 * Returns null (no throw) if the email is already registered under a
 * different provider — auth.ts's signIn() callback turns that into a
 * rejected sign-in. No auto-linking across providers (deliberate).
 */
export async function upsertGoogleUser({ email, name }: UpsertGoogleUserInput): Promise<User | null> {
  return adminDb.runTransaction(async (tx) => {
    const ref = adminDb.collection(AUTH_COLLECTIONS.users).doc(email);
    const snap = await tx.get(ref);

    if (snap.exists) {
      const existing = toUser(snap);
      return existing.authProvider === "google" ? existing : null;
    }

    const now = FieldValue.serverTimestamp();
    tx.set(ref, {
      email,
      name,
      phone: null,
      role: "customer",
      authProvider: "google",
      pointsBalance: 0,
      activeRedemptionOrderId: null,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: email,
      email,
      name,
      phone: null,
      role: "customer",
      authProvider: "google",
      pointsBalance: 0,
      activeRedemptionOrderId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  });
}
