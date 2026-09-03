import { REWARDS_CATALOG } from "@/modules/loyalty/content/rewardsCatalog";
import { getNextRewardGoal } from "@/modules/loyalty/lib/getNextRewardGoal";
import type { RewardsStats } from "@/modules/loyalty/lib/computeRewardsStats";
import {
  REWARDS_CATALOG_HEADING,
  REWARDS_FOOTNOTE,
  REWARDS_HERO_LABEL,
  REWARDS_RATE_VALUE,
  REWARDS_STAT_LABELS,
  rewardsNudge,
} from "../content/rewardsContent";
import { RewardCatalogGrid } from "./RewardCatalogGrid";

export function RewardsShell({
  pointsBalance,
  stats,
}: {
  pointsBalance: number;
  stats: RewardsStats;
}) {
  const nextGoal = getNextRewardGoal(pointsBalance, REWARDS_CATALOG);
  const progressPercent = nextGoal === null ? 100 : Math.min(100, Math.round((pointsBalance / nextGoal) * 100));

  return (
    <div className="grid gap-8">
      <div className="rounded-2xl bg-ink px-6 py-8 text-bg sm:px-8">
        <div className="grid gap-8 sm:grid-cols-[1fr_auto]">
          <div>
            <div className="font-mono text-xs uppercase tracking-wide opacity-60">{REWARDS_HERO_LABEL}</div>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="font-display text-[clamp(3rem,7vw,4.6rem)] leading-none">{pointsBalance}</span>
              {nextGoal !== null && <span className="text-[15px] opacity-70">of {nextGoal}</span>}
            </div>
            <div
              className="mt-4 h-2.5 overflow-hidden rounded-pill"
              style={{ backgroundColor: "color-mix(in srgb, var(--color-bg) 18%, transparent)" }}
            >
              <div className="h-full rounded-pill bg-gold" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-3 text-[14.5px] opacity-80">{rewardsNudge(pointsBalance, nextGoal)}</p>
          </div>
          <div className="grid content-start gap-3 sm:min-w-[200px]">
            <div className="flex justify-between gap-4 text-[14.5px]">
              <span className="opacity-70">{REWARDS_STAT_LABELS.earnedThisYear}</span>
              <span className="font-mono">{stats.earnedThisYear}</span>
            </div>
            <div className="flex justify-between gap-4 text-[14.5px]">
              <span className="opacity-70">{REWARDS_STAT_LABELS.redeemed}</span>
              <span className="font-mono">{stats.redeemed}</span>
            </div>
            <div className="flex justify-between gap-4 text-[14.5px]">
              <span className="opacity-70">{REWARDS_STAT_LABELS.rate}</span>
              <span className="font-mono">{REWARDS_RATE_VALUE}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl text-ink">{REWARDS_CATALOG_HEADING}</h2>
        <RewardCatalogGrid pointsBalance={pointsBalance} />
      </div>

      <p className="max-w-2xl text-[13.5px] text-ink-subtle">{REWARDS_FOOTNOTE}</p>
    </div>
  );
}
