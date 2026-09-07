import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/**
 * Server-only. Never import from a Client Component — firebase-admin's
 * node-only APIs will fail to bundle if you try.
 */

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: getRequiredEnv("FIREBASE_PROJECT_ID"),
      clientEmail: getRequiredEnv("FIREBASE_CLIENT_EMAIL"),
      // .env files store the PEM with literal "\n" escapes.
      privateKey: getRequiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
  });

export const adminDb = getFirestore(app);
export const adminStorage = getStorage(app).bucket(getRequiredEnv("FIREBASE_STORAGE_BUCKET"));
