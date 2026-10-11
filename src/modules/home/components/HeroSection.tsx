import Image from "next/image";
import { ButtonLink } from "@/shared/components";
import { ROUTES } from "@/shared/routes";
import { HOME_HERO } from "../content/homeContent";
import type { OpenStatus } from "../types/open-status";
import { OpenStatusBadge } from "./OpenStatusBadge";

export interface HeroSectionProps {
  initialOpenStatus: OpenStatus;
}

export function HeroSection({ initialOpenStatus }: HeroSectionProps) {
  return (
    <section className="mx-auto grid max-w-page items-center gap-6 px-4 pb-6 pt-7 sm:px-8 md:grid-cols-2 md:gap-14 md:pb-12 md:pt-16">
      <div className="max-w-xl">
        <div className="mb-5">
          <OpenStatusBadge initialStatus={initialOpenStatus} />
        </div>
        <h1 className="mb-5 font-display text-hero font-medium text-ink">
          {HOME_HERO.heading.lead}
          <br />
          <span className="italic text-gold">{HOME_HERO.heading.accent}</span> {HOME_HERO.heading.tail}
        </h1>
        <p className="mb-8 max-w-md text-base text-ink-muted md:text-lg">{HOME_HERO.body}</p>
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href={ROUTES.menu}>{HOME_HERO.ctaPrimary}</ButtonLink>
          <ButtonLink href={ROUTES.contact} variant="secondary">
            {HOME_HERO.ctaSecondary}
          </ButtonLink>
        </div>
      </div>

      <div className="relative">
        <div className="relative aspect-portrait overflow-hidden rounded-2xl bg-sunken shadow-xl">
          <Image
            src={HOME_HERO.mainPhoto.src}
            alt={HOME_HERO.mainPhoto.alt}
            fill
            priority
            sizes="(min-width: 1240px) 590px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute -bottom-4 -left-1.5 aspect-square w-5/12 max-w-48 overflow-hidden rounded-xl border-4 border-bg bg-sunken shadow-lg">
          <Image
            src={HOME_HERO.insetPhoto.src}
            alt={HOME_HERO.insetPhoto.alt}
            fill
            sizes="(min-width: 768px) 192px, 42vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
