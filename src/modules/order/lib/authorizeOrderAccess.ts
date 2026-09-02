import type { SessionUser } from "@/modules/auth/types/session-user";
import type { Order } from "../types/order";

export interface OrderAccessResult {
  allowed: boolean;
  /** Only meaningful when allowed is true. */
  shouldPoll: boolean;
}

const DENIED: OrderAccessResult = { allowed: false, shouldPoll: false };

/**
 * The single authorization decision for an order — used identically by
 * the confirmation page's initial server-side fetch AND the polling API
 * route it hits repeatedly (that route is the actually-exposed surface,
 * so it must re-run this itself rather than trust the page already did).
 *
 * A Firestore auto-generated order id is already unguessable (~120 bits
 * of entropy), but unguessability alone isn't authorization — this is
 * the real access-control layer on top of it.
 *
 * - Signed-in owner: always allowed (this is also the correct rule for a
 *   future order-history page — Phase 5, out of scope — which will reuse
 *   this same function unchanged). Only polls if the session_id in the
 *   URL happens to match too, i.e. a genuine post-checkout redirect.
 * - Guest order (userId is null): the ONLY proof of ownership is knowing
 *   the exact Stripe session id from the checkout redirect. No session_id
 *   match means no access — there is no other identity to check.
 * - Everything else (non-owner, or a session_id that doesn't match this
 *   order) is denied outright: never reveal whether the order exists.
 */
export function authorizeOrderAccess(
  order: Order,
  sessionUser: SessionUser | null,
  sessionIdParam: string | null,
): OrderAccessResult {
  if (sessionUser != null && sessionUser.id === order.userId) {
    return { allowed: true, shouldPoll: sessionIdParam === order.stripeSessionId };
  }

  if (order.userId === null && sessionIdParam != null && sessionIdParam === order.stripeSessionId) {
    return { allowed: true, shouldPoll: true };
  }

  return DENIED;
}
