import { fileTypeFromBuffer } from "file-type";
import { requireAdminSession } from "@/modules/auth/lib/requireAdminSession";
import { uploadMenuItemImage } from "@/modules/menu/api";
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_UPLOAD_BYTES } from "@/modules/menu/lib/imageUpload";
import { logError } from "@/shared/utils/log-error";

/**
 * Reads the file server-side (multipart/form-data) rather than handing
 * the client a signed direct-to-Storage upload URL — that's the only flow
 * where magic-byte validation can happen before anything touches Storage.
 */
export async function POST(req: Request) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return Response.json({ error: "File is too large" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Real content only, from the bytes themselves — never the client-
  // supplied filename or Content-Type header, both spoofable.
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED_IMAGE_MIME_TYPES.has(detected.mime)) {
    return Response.json({ error: "Unsupported or unrecognized image file" }, { status: 415 });
  }

  try {
    const url = await uploadMenuItemImage(buffer, detected.mime, detected.ext);
    return Response.json({ url }, { status: 201 });
  } catch (error) {
    logError(error, "admin.menu.images.upload", { level: "error" });
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
