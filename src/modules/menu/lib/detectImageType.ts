export interface DetectedImageType {
  mime: string;
  ext: string;
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  if (bytes.length < offset + signature.length) return false;
  return signature.every((byte, index) => bytes[offset + index] === byte);
}

function asciiBytes(text: string): number[] {
  return Array.from(text, (char) => char.charCodeAt(0));
}

/**
 * Magic-byte sniffing for the only types uploads accept (see
 * ALLOWED_IMAGE_MIME_TYPES) — in-house rather than the file-type package,
 * whose ESM imports Next's output file tracing missed, so the deployed
 * route crashed on load with ERR_MODULE_NOT_FOUND.
 */
export function detectImageType(bytes: Uint8Array): DetectedImageType | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { mime: "image/jpeg", ext: "jpg" };
  if (startsWith(bytes, PNG_SIGNATURE)) return { mime: "image/png", ext: "png" };
  if (startsWith(bytes, asciiBytes("RIFF")) && startsWith(bytes, asciiBytes("WEBP"), 8)) {
    return { mime: "image/webp", ext: "webp" };
  }
  return null;
}
