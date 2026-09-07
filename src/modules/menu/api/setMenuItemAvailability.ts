import { adminDb } from "@/shared/lib/firebase-admin";
import { MENU_COLLECTIONS } from "../lib/collections";
import { MenuEntityNotFoundError } from "../lib/errors";

/** The 86-toggle's backend — a focused single-field write, not a full item update. */
export async function setMenuItemAvailability(id: string, isAvailable: boolean): Promise<void> {
  const ref = adminDb.collection(MENU_COLLECTIONS.menuItems).doc(id);
  const existing = await ref.get();
  if (!existing.exists) {
    throw new MenuEntityNotFoundError("MenuItem", id);
  }
  await ref.update({ isAvailable });
}
