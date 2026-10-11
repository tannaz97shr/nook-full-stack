import Image from "next/image";
import { ButtonLink } from "@/shared/components";
import { ROUTES } from "@/shared/routes";
import { HOME_REWARDS } from "../content/homeContent";

export interface RewardsBannerProps {
  isSignedIn: boolean;
}

/** Theme-invariant on purpose: on-photo colors over a fixed dark scrim read the same in light and dark. */
export function RewardsBanner({ isSignedIn }: RewardsBannerProps) {
  return (
    <section className="mx-auto max-w-page px-4 pb-14 sm:px-8 md:pb-24">
      <div className="relative grid min-h-72 overflow-hidden rounded-2xl bg-sunken shadow-lg md:min-h-96">
        <Image
          src={HOME_REWARDS.photo.src}
          alt={HOME_REWARDS.photo.alt}
          fill
          // Renders up to 1176px wide, but claiming that makes DPR-2 screens
          // round up to the w=3840 variant (the source is only 2400px). Capped
          // so they get w=2048 — plenty under the dark scrim.
          sizes="(min-width: 640px) 1024px, 100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-photo-scrim-narrow md:bg-photo-scrim" />
        <div className="relative flex max-w-xl flex-col justify-center p-7 md:p-14">
          <h2 className="mb-3.5 text-balance font-display text-3xl font-medium tracking-tight text-on-photo md:text-4xl">
            {/* Forced break only from md up — on phones it stopped text-balance
                from balancing the whole heading and orphaned "visit". */}
            {HOME_REWARDS.heading.lead}{" "}
            <br className="hidden md:inline" />
            {HOME_REWARDS.heading.tail}
          </h2>
          <p className="mb-6 max-w-md text-base text-on-photo-muted">{HOME_REWARDS.body}</p>
          <div>
            <ButtonLink
              href={isSignedIn ? ROUTES.account.rewards : ROUTES.signUp}
              variant="on-photo"
            >
              {isSignedIn ? HOME_REWARDS.ctaSignedIn : HOME_REWARDS.ctaSignedOut}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
