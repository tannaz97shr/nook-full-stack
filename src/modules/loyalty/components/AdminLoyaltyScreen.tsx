"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminRewardsTable } from "./AdminRewardsTable";
import { AdminRewardForm } from "./AdminRewardForm";
import type { RewardCatalogItem } from "../types/reward";

export interface AdminLoyaltyScreenProps {
  rewards: RewardCatalogItem[];
}

type RewardModalState = { mode: "create" } | { mode: "edit"; reward: RewardCatalogItem } | null;

/**
 * Rewards data is RSC-fetched (see admin/loyalty/page.tsx) — mutations
 * close their modal and call router.refresh(), which re-runs the server
 * component for fresh data. No parallel client-side cache.
 *
 * AdminRewardForm is only mounted while rewardModal is non-null (not
 * always-mounted with an `open` boolean prop) so its useForm() defaultValues
 * are recomputed fresh every time it opens for a different/new target,
 * rather than persisting stale values from a previous edit session.
 */
export function AdminLoyaltyScreen({ rewards }: AdminLoyaltyScreenProps) {
  const router = useRouter();
  const [rewardModal, setRewardModal] = useState<RewardModalState>(null);

  function handleSaved() {
    setRewardModal(null);
    router.refresh();
  }

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="font-display text-2xl text-ink">Loyalty</h1>
        <p className="text-[13px] text-ink-subtle">Manage the rewards catalog.</p>
      </div>

      <AdminRewardsTable
        rewards={rewards}
        onEdit={(reward) => setRewardModal({ mode: "edit", reward })}
        onCreateNew={() => setRewardModal({ mode: "create" })}
      />

      {rewardModal && (
        <AdminRewardForm
          open
          onClose={() => setRewardModal(null)}
          onSaved={handleSaved}
          reward={rewardModal.mode === "edit" ? rewardModal.reward : undefined}
        />
      )}
    </div>
  );
}
