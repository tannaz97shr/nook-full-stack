/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // images.remotePatterns (Firebase Storage bucket) and CSP headers land
  // later — CSP will need a nonce/hash for the inline theme-bootstrap
  // script in layout.tsx / global-error.tsx once it's added.
};

export default nextConfig;
