import { randomUUID } from "crypto";
import { adminStorage } from "@/shared/lib/firebase-admin";
import { buildTokenGatedDownloadUrl } from "@/shared/lib/storageDownloadUrl";

/**
 * Path is decoupled from any menuItemId — a brand-new item has no id yet
 * at image-pick time, and item ids are immutable after creation, so
 * coupling the path to one that might not exist (or belong to an
 * abandoned draft) adds nothing. contentType/extension must come from
 * magic-byte detection, never the client-supplied filename/MIME header.
 */
export async function uploadMenuItemImage(buffer: Buffer, contentType: string, extension: string): Promise<string> {
  const filePath = `menu-items/${randomUUID()}.${extension}`;
  const token = randomUUID();

  await adminStorage.file(filePath).save(buffer, {
    metadata: { contentType, metadata: { firebaseStorageDownloadTokens: token } },
  });

  return buildTokenGatedDownloadUrl(adminStorage.name, filePath, token);
}
