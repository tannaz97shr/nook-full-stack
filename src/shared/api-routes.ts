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
  checkout: `${API_BASE}/checkout`,
  orders: {
    byId: (orderId: string) => `${API_BASE}/orders/${orderId}`,
  },
  loyalty: {
    balance: `${API_BASE}/loyalty/balance`,
    catalog: `${API_BASE}/loyalty/catalog`,
  },
  admin: {
    menu: {
      categories: {
        base: `${API_BASE}/admin/menu/categories`,
        byId: (categoryId: string) => `${API_BASE}/admin/menu/categories/${categoryId}`,
      },
      items: {
        base: `${API_BASE}/admin/menu/items`,
        byId: (itemId: string) => `${API_BASE}/admin/menu/items/${itemId}`,
        availability: (itemId: string) => `${API_BASE}/admin/menu/items/${itemId}/availability`,
      },
      optionGroups: {
        base: `${API_BASE}/admin/menu/option-groups`,
        byId: (groupId: string) => `${API_BASE}/admin/menu/option-groups/${groupId}`,
      },
      images: `${API_BASE}/admin/menu/images`,
    },
    orders: {
      status: (orderId: string) => `${API_BASE}/admin/orders/${orderId}/status`,
    },
    loyalty: {
      rewards: {
        base: `${API_BASE}/admin/loyalty/rewards`,
        byId: (rewardId: string) => `${API_BASE}/admin/loyalty/rewards/${rewardId}`,
        active: (rewardId: string) => `${API_BASE}/admin/loyalty/rewards/${rewardId}/active`,
      },
    },
  },
  webhooks: {
    // Server-to-server only (Stripe calls this directly) — never fetched
    // from client code, but kept here anyway so the literal path string
    // exists in exactly one place.
    stripe: `${API_BASE}/webhooks/stripe`,
  },
} as const;
