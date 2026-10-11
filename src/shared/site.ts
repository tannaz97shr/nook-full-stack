/**
 * Absolute site origin, used as Next's `metadataBase` so og:image /
 * twitter:image URLs are absolute and point at the right host:
 *
 * 1. SITE_URL — explicit override (e.g. once a custom domain exists).
 * 2. Vercel production — VERCEL_PROJECT_PRODUCTION_URL, Vercel's system var
 *    for the project's production domain (custom domain if one is assigned).
 * 3. Vercel preview — VERCEL_URL, this deployment's own URL, so link previews
 *    of a PR deployment resolve against that deployment.
 * 4. Local dev — localhost.
 *
 * Vercel's system vars are host names without a scheme, hence the https://.
 */
function resolveSiteUrl(): string {
  const { SITE_URL: override, VERCEL_ENV, VERCEL_PROJECT_PRODUCTION_URL, VERCEL_URL, PORT } = process.env;

  if (override) return override;
  if (VERCEL_ENV === "production" && VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (VERCEL_URL) return `https://${VERCEL_URL}`;
  return `http://localhost:${PORT ?? 3000}`;
}

export const SITE_URL = resolveSiteUrl();

/**
 * Shared Open Graph defaults. Next shallow-merges metadata, so a page that
 * sets its own `openGraph` must spread these back in or it loses them.
 */
export const SITE_OPEN_GRAPH = {
  siteName: "Nook",
  locale: "en_AU",
  type: "website",
} as const;
