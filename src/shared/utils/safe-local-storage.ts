import { logError } from "./log-error";

/**
 * localStorage throws in Safari private mode (see theme.ts) and its content
 * is arbitrary/unvalidated JSON from a prior session, so every read/write
 * goes through here rather than being called directly at each call site.
 */
export function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    logError(error, `readLocalStorage:${key}`, { level: "warn" });
    return fallback;
  }
}

export function writeLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    logError(error, `writeLocalStorage:${key}`, { level: "warn" });
  }
}
