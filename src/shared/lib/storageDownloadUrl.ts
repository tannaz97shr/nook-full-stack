/**
 * The Admin SDK has no client-SDK-style getDownloadURL() — a token-gated
 * URL has to be hand-built from the same firebaseStorageDownloadTokens
 * custom-metadata convention the client SDK reads. Caller is responsible
 * for setting that token in the file's metadata at write time.
 */
export function buildTokenGatedDownloadUrl(bucketName: string, filePath: string, token: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media&token=${token}`;
}
