"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/shared/hooks/useToast";
import { formatMoney } from "@/shared/utils/format-money";
import { useRewardActiveToggle } from "../hooks/useRewardActiveToggle";
import { ACTIVE_TOGGLE_ERROR, ADMIN_REWARDS_FOOTNOTE, NEW_REWARD_LABEL } from "../content/adminLoyaltyContent";
import type { RewardCatalogItem } from "../types/reward";

export interface AdminRewardsTableProps {
  rewards: RewardCatalogItem[];
  onEdit: (reward: RewardCatalogItem) => void;
  onCreateNew: () => void;
}

/** The active-toggle: optimistic local flip with rollback+toast on error, independent of the RSC-fetched rewards prop. */
export function AdminRewardsTable({ rewards, onEdit, onCreateNew }: AdminRewardsTableProps) {
  const [localRewards, setLocalRewards] = useState(rewards);
  const { showToast } = useToast();
  const toggle = useRewardActiveToggle();

  useEffect(() => {
    setLocalRewards(rewards);
  }, [rewards]);

  function handleToggle(reward: RewardCatalogItem) {
    const nextActive = !reward.isActive;
    setLocalRewards((current) =>
      current.map((existing) => (existing.id === reward.id ? { ...existing, isActive: nextActive } : existing)),
    );
    toggle.mutate(
      { rewardId: reward.id, isActive: nextActive },
      {
        onError: () => {
          setLocalRewards((current) =>
            current.map((existing) =>
              existing.id === reward.id ? { ...existing, isActive: reward.isActive } : existing,
            ),
          );
          showToast(ACTIVE_TOGGLE_ERROR, "error");
        },
      },
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCreateNew}
          className="rounded-pill bg-gold px-4 py-2 text-[13.5px] font-bold text-gold-ink hover:bg-gold-hover"
        >
          {NEW_REWARD_LABEL}
        </button>
      </div>

      <div className="overflow-x-auto rounded-md border border-border bg-admin-panel">
        <div className="grid min-w-[640px] grid-cols-[2fr_1fr_1fr_1fr] gap-3.5 border-b border-border bg-admin-row px-[17px] py-[11px] font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-subtle">
          <span>Reward</span>
          <span>Points cost</span>
          <span>Discount value</span>
          <span>Active</span>
        </div>
        {localRewards.map((reward) => (
          <div
            key={reward.id}
            className="grid min-w-[640px] grid-cols-[2fr_1fr_1fr_1fr] items-center gap-3.5 border-b border-border px-[17px] py-3 last:border-b-0"
          >
            <button type="button" onClick={() => onEdit(reward)} className="min-w-0 text-left">
              <span className="block truncate text-[13.5px] font-semibold text-ink">{reward.name}</span>
              <span className="block font-mono text-[10.5px] text-ink-subtle">{reward.id}</span>
            </button>
            <span className="font-mono text-[13px] text-ink">{reward.pointsCost} pts</span>
            <span className="font-mono text-[13px] text-ink">{formatMoney(reward.discountValue)}</span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                role="switch"
                aria-checked={reward.isActive}
                aria-label={`Toggle active status for ${reward.name}`}
                onClick={() => handleToggle(reward)}
                className={`relative h-6 w-[42px] shrink-0 rounded-pill transition-colors ${
                  reward.isActive ? "bg-leaf" : "bg-border-strong"
                }`}
              >
                <span
                  className={`absolute top-[3px] h-[18px] w-[18px] rounded-pill bg-surface shadow-sm transition-transform ${
                    reward.isActive ? "translate-x-[21px]" : "translate-x-[3px]"
                  }`}
                />
              </button>
              <span className="text-[12px] font-semibold text-ink-muted">
                {reward.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[12.5px] text-ink-subtle">{ADMIN_REWARDS_FOOTNOTE}</p>
    </div>
  );
}
