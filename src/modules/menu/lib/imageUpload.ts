/** Detected via file-type's magic-byte sniffing — never the client-supplied filename/MIME header. */
export const ALLOWED_IMAGE_MIME_TYPES: ReadonlySet<string> = new Set(["image/jpeg", "image/png", "image/webp"]);

export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;
