"use client";

import { Button } from "@/shared/components";
import { useCart } from "@/modules/cart/hooks/useCart";
import { REWARDS_CATALOG } from "@/modules/loyalty/content/rewardsCatalog";
import { REWARDS_REDEEM_LABEL, rewardInsufficientPointsTitle } from "../content/rewardsContent";

/**
 * Selecting a reward here just stores the selection on the cart (the
 * actual "checkout" UI, since there's no separate checkout page) and
 * opens the drawer — the drawer is where the discount is actually applied
 * and where the real checkout request fires.
 */
export function RewardCatalogGrid({ pointsBalance }: { pointsBalance: number }) {
  const { selectedRewardId, selectReward, clearReward, open } = useCart();

  function handleClick(rewardId: string) {
    if (selectedRewardId === rewardId) {
      clearReward();
      return;
    }
    selectReward(rewardId);
    open();
  }

  return (
    <div className="mt-4 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr))]">
      {REWARDS_CATALOG.map((reward) => {
        const affordable = pointsBalance >= reward.pointsCost;
        const isSelected = selectedRewardId === reward.id;
        return (
          <div key={reward.id} className="grid gap-2 rounded-xl border border-border bg-surface p-5">
            <span className="font-mono text-[13px] font-semibold text-gold">{reward.pointsCost} pts</span>
            <h3 className="font-display text-lg text-ink">{reward.name}</h3>
            <p className="text-[14px] text-ink-muted">{reward.description}</p>
            <Button
              variant={isSelected ? "primary" : "secondary"}
              disabled={!affordable}
              title={affordable ? undefined : rewardInsufficientPointsTitle(reward.pointsCost, pointsBalance)}
              onClick={() => handleClick(reward.id)}
              className="mt-2"
            >
              {isSelected ? "Selected — open cart" : REWARDS_REDEEM_LABEL}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
