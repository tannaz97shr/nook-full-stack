/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Admin-uploaded menu item photos are token-gated Firebase Storage
    // download URLs (see src/shared/lib/storageDownloadUrl.ts) — every
    // bucket serves from this one host, so no per-project pattern needed.
    remotePatterns: [{ protocol: "https", hostname: "firebasestorage.googleapis.com" }],
  },
  // CSP headers land later — will need a nonce/hash for the inline
  // theme-bootstrap script in layout.tsx / global-error.tsx once added.
};

export default nextConfig;
