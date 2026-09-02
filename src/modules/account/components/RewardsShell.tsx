import { Button } from "@/shared/components";
import {
  REWARDS_CATALOG,
  REWARDS_CATALOG_HEADING,
  REWARDS_FOOTNOTE,
  REWARDS_HERO,
  REWARDS_REDEEM_DEFERRED_TITLE,
  REWARDS_REDEEM_LABEL,
  REWARDS_STATS,
} from "../content/rewardsContent";

/**
 * PHASE 5b BOUNDARY: this whole component renders static placeholder
 * content from ../content/rewardsContent.ts — no real points balance or
 * redemption logic exists yet (see that file's own comment). Redeem
 * buttons are uniformly disabled rather than branching on a fake
 * locked/unlocked state, since comparing placeholder numbers would still
 * read as functional points math.
 */
export function RewardsShell() {
  const progressPercent = Math.min(100, Math.round((REWARDS_HERO.points / REWARDS_HERO.goal) * 100));

  return (
    <div className="grid gap-8">
      <div className="rounded-2xl bg-ink px-6 py-8 text-bg sm:px-8">
        <div className="grid gap-8 sm:grid-cols-[1fr_auto]">
          <div>
            <div className="font-mono text-xs uppercase tracking-wide opacity-60">{REWARDS_HERO.label}</div>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="font-display text-[clamp(3rem,7vw,4.6rem)] leading-none">{REWARDS_HERO.points}</span>
              <span className="text-[15px] opacity-70">of {REWARDS_HERO.goal}</span>
            </div>
            <div
              className="mt-4 h-2.5 overflow-hidden rounded-pill"
              style={{ backgroundColor: "color-mix(in srgb, var(--color-bg) 18%, transparent)" }}
            >
              <div className="h-full rounded-pill bg-gold" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-3 text-[14.5px] opacity-80">{REWARDS_HERO.nudge}</p>
          </div>
          <div className="grid content-start gap-3 sm:min-w-[200px]">
            {REWARDS_STATS.map((stat) => (
              <div key={stat.label} className="flex justify-between gap-4 text-[14.5px]">
                <span className="opacity-70">{stat.label}</span>
                <span className="font-mono">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl text-ink">{REWARDS_CATALOG_HEADING}</h2>
        <div className="mt-4 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr))]">
          {REWARDS_CATALOG.map((reward) => (
            <div key={reward.id} className="grid gap-2 rounded-xl border border-border bg-surface p-5">
              <span className="font-mono text-[13px] font-semibold text-gold">{reward.cost}</span>
              <h3 className="font-display text-lg text-ink">{reward.name}</h3>
              <p className="text-[14px] text-ink-muted">{reward.description}</p>
              <Button variant="secondary" disabled title={REWARDS_REDEEM_DEFERRED_TITLE} className="mt-2">
                {REWARDS_REDEEM_LABEL}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <p className="max-w-2xl text-[13.5px] text-ink-subtle">{REWARDS_FOOTNOTE}</p>
    </div>
  );
}
