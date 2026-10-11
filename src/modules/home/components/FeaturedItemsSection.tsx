import { ButtonLink } from "@/shared/components";
import { ROUTES } from "@/shared/routes";
import { HOME_FEATURED } from "../content/homeContent";
import type { FeaturedItemsResult } from "../types/featured";
import { FeaturedItemsGrid } from "./FeaturedItemsGrid";

export interface FeaturedItemsSectionProps {
  featured: FeaturedItemsResult;
}

/** Hidden entirely when nothing qualifies (none featured, or all featured items 86'd). */
export function FeaturedItemsSection({ featured }: FeaturedItemsSectionProps) {
  if (featured.status === "ok" && featured.items.length === 0) return null;

  return (
    <section className="mx-auto max-w-page px-4 py-11 sm:px-8 md:py-20">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
        <div>
          <span className="mb-2.5 block font-mono text-xs uppercase text-ink-subtle">
            {HOME_FEATURED.eyebrow}
          </span>
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
            {HOME_FEATURED.heading}
          </h2>
        </div>
        <ButtonLink href={ROUTES.menu} variant="secondary">
          {HOME_FEATURED.cta}
        </ButtonLink>
      </div>

      {featured.status === "ok" ? (
        <FeaturedItemsGrid
          items={featured.items}
          optionGroupsById={featured.optionGroupsById}
          optionsById={featured.optionsById}
        />
      ) : (
        <p role="alert" className="rounded-lg border border-border bg-surface p-6 text-ink-muted">
          {HOME_FEATURED.loadError}
        </p>
      )}
    </section>
  );
}
