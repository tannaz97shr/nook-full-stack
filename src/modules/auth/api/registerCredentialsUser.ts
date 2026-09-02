import bcrypt from "bcryptjs";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/shared/lib/firebase-admin";
import { AUTH_COLLECTIONS } from "../lib/collections";
import { EmailAlreadyRegisteredError } from "../lib/errors";
import type { User } from "../types/user";

interface RegisterCredentialsUserInput {
  email: string;
  name: string;
  password: string;
}

/**
 * Server-only. Transactional dual-write: users/{email} + credentials/{email}.
 * Throws EmailAlreadyRegisteredError if the email is already taken, by
 * either provider — no auto-linking (see plan decision on provider
 * collisions).
 */
export async function registerCredentialsUser({
  email,
  name,
  password,
}: RegisterCredentialsUserInput): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 12);

  return adminDb.runTransaction(async (tx) => {
    const userRef = adminDb.collection(AUTH_COLLECTIONS.users).doc(email);
    const existing = await tx.get(userRef);
    if (existing.exists) {
      throw new EmailAlreadyRegisteredError(email);
    }

    const now = FieldValue.serverTimestamp();
    tx.set(userRef, {
      email,
      name,
      phone: null,
      role: "customer",
      authProvider: "credentials",
      createdAt: now,
      updatedAt: now,
    });
    tx.set(adminDb.collection(AUTH_COLLECTIONS.credentials).doc(email), {
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: email,
      email,
      name,
      phone: null,
      role: "customer",
      authProvider: "credentials",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  });
}
