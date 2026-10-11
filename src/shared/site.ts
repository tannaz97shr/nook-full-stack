/**
 * Absolute site origin, used as Next's `metadataBase` so Open Graph image
 * URLs are absolute. Set SITE_URL per environment (e.g. the Vercel domain);
 * falls back to the local dev server.
 */
export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

/**
 * Shared Open Graph defaults. Next shallow-merges metadata, so a page that
 * sets its own `openGraph` must spread these back in or it loses them.
 */
export const SITE_OPEN_GRAPH = {
  siteName: "Nook",
  locale: "en_AU",
  type: "website",
} as const;
