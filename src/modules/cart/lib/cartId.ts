import { readLocalStorage, writeLocalStorage } from "@/shared/utils/safe-local-storage";

const ANON_ID_STORAGE_KEY = "nook:anonId";

/** Client-effect only — never call during SSR render, localStorage isn't available there. */
export function getOrCreateAnonId(): string {
  const existing = readLocalStorage<string | null>(ANON_ID_STORAGE_KEY, null);
  if (existing) return existing;

  const id = crypto.randomUUID();
  writeLocalStorage(ANON_ID_STORAGE_KEY, id);
  return id;
}

/**
 * Signed-in users key by their session id; guests key by a per-device
 * anonymous id persisted once — forward-compatible with Phase 5's
 * reorder/loyalty work wanting a stable anchor to merge a guest cart into
 * a signed-in one, at effectively zero extra cost over a flat "guest" key.
 */
export function cartStorageKey(userId: string | null): string {
  const effectiveId = userId ?? `guest:${getOrCreateAnonId()}`;
  return `nook:cart:${effectiveId}`;
}
