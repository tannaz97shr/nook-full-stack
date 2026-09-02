/**
 * Single source of truth for API paths. No backend/data layer exists yet
 * (that starts in Phase 2), so this is a minimal scaffold — do not invent
 * endpoints for entities that don't have types yet.
 *
 * Paths are root-absolute and include the `/api` prefix, so the shared
 * Axios instance must be created with NO `baseURL` (avoids a double-prefix
 * bug). Parameterized endpoints follow the same function-per-route
 * convention as routes.ts, e.g. `order: (id: string) => \`${API_BASE}/orders/${id}\``.
 *
 * Menu/orders/checkout/Stripe-webhook/loyalty endpoints land in Phase 2+
 * alongside their respective modules.
 */
export const API_BASE = "/api";

export const API_ROUTES = {
  base: API_BASE,
  auth: {
    // Auth.js catch-all: src/app/api/auth/[...nextauth]/route.ts
    base: `${API_BASE}/auth`,
    register: `${API_BASE}/auth/register`,
  },
} as const;
