import { getUserByEmail } from "@/modules/auth/api";
import type { SessionUser } from "@/modules/auth/types/session-user";
import type { OrderRedemption } from "@/modules/order/types/order";
import { roundToCents } from "@/shared/utils/format-money";
import { getRewardById } from "./getRewardById";

export type VerifyRedemptionResult =
  | { ok: true; redemption: OrderRedemption | null }
  | { ok: false; reason: string };

/**
 * Cheap first-pass re-verification of a client-claimed reward selection —
 * never trusts the client's rewardId or the fact that the UI's Redeem
 * button was enabled. Guests can never redeem (account-only, per spec),
 * even if a tampered request supplies a rewardId. This is a plain read,
 * not a lock — the authoritative, race-safe check happens again inside
 * reserveRedemptionOrder's transaction right before the order is created.
 */
export async function verifyRedemption(
  rewardId: string | null,
  sessionUser: SessionUser | null,
  preDiscountTotal: number,
): Promise<VerifyRedemptionResult> {
  if (rewardId === null) {
    return { ok: true, redemption: null };
  }

  if (sessionUser === null) {
    return { ok: false, reason: "Sign in to redeem a reward" };
  }

  const reward = getRewardById(rewardId);
  if (!reward) {
    return { ok: false, reason: "That reward is no longer available" };
  }

  const user = await getUserByEmail(sessionUser.id);
  if (!user || user.pointsBalance < reward.pointsCost) {
    return { ok: false, reason: "Not enough points for that reward" };
  }

  const discountAmount = roundToCents(Math.min(reward.discountValue, preDiscountTotal));
  return { ok: true, redemption: { rewardId: reward.id, pointsCost: reward.pointsCost, discountAmount } };
}
