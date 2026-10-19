import type { Metadata } from "next";
import { ButtonLink } from "@/shared/components";
import { SiteChrome } from "@/shared/components/templates/SiteChrome";
import { ERROR_CONTENT } from "@/shared/content/error-content";
import { ROUTES } from "@/shared/routes";

export const metadata: Metadata = { title: "Page not found" };

const COPY = ERROR_CONTENT.notFound;

// Root-level, so it handles every unmatched URL and every notFound() call.
// Next renders it outside the (site) route group, so it brings the public
// chrome with it.
export default function NotFound() {
  return (
    <SiteChrome>
      <main className="mx-auto flex min-h-[60vh] max-w-[1240px] items-center justify-center px-4 py-16 sm:px-8">
        <div className="flex max-w-lg flex-col items-center text-center">
          <p className="font-mono text-sm font-medium tracking-widest text-gold">{COPY.eyebrow}</p>
          <h1 className="mt-3 text-balance font-display text-4xl font-medium text-ink md:text-5xl">{COPY.title}</h1>
          <p className="mt-4 text-base text-ink-muted md:text-lg">{COPY.description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={ROUTES.menu}>{COPY.primaryAction}</ButtonLink>
            <ButtonLink href={ROUTES.home} variant="secondary">
              {COPY.secondaryAction}
            </ButtonLink>
          </div>
        </div>
      </main>
    </SiteChrome>
  );
}
