import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/shared/routes";
import {
  ABOUT_ATMOSPHERE_PHOTO,
  ABOUT_FIRST_YEAR,
  ABOUT_HERO,
  ABOUT_QUOTE,
  ABOUT_TIMELINE,
} from "../content/aboutContent";

const CTA_PRIMARY_CLASSES =
  "inline-flex items-center justify-center gap-[11px] rounded-pill bg-gold px-6 py-4 text-base font-bold text-gold-ink shadow-md transition-colors hover:bg-gold-hover";
const CTA_SECONDARY_CLASSES =
  "inline-flex items-center justify-center gap-[11px] rounded-pill border border-border-strong bg-surface px-6 py-[14px] text-[15px] font-semibold text-ink transition-colors hover:bg-sunken";

export function AboutScreen() {
  return (
    <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-8 md:py-12">
      <div className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-subtle">
          {ABOUT_HERO.eyebrow}
        </span>
        <h1 className="mt-3 font-display text-4xl text-ink">{ABOUT_HERO.heading}</h1>
        <p className="mt-4 text-lg text-ink-muted">{ABOUT_HERO.body}</p>
      </div>

      <div className="relative mt-8 aspect-[16/7] overflow-hidden rounded-2xl bg-sunken shadow-lg">
        <Image
          src={ABOUT_ATMOSPHERE_PHOTO.src}
          alt={ABOUT_ATMOSPHERE_PHOTO.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <p
          className="absolute bottom-0 left-0 p-4 font-display text-lg italic"
          // Same static-overlay-text exemption as AuthScreen.tsx — sits on a
          // photo, must stay legible regardless of app theme.
          style={{ color: "#FBF7F0" }}
        >
          {ABOUT_ATMOSPHERE_PHOTO.caption}
        </p>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-overlay to-transparent" />
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <h2 className="font-display text-2xl text-ink">{ABOUT_FIRST_YEAR.heading}</h2>
          {ABOUT_FIRST_YEAR.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-ink-muted">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {ABOUT_FIRST_YEAR.photos.map((photo) => (
            <div key={photo.src} className="relative aspect-[4/5] overflow-hidden rounded-xl bg-sunken shadow-sm">
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <blockquote className="mt-12 rounded-2xl bg-sunken px-6 py-10 text-center shadow-sm sm:px-12">
        <p className="font-display text-2xl italic leading-snug text-ink sm:text-3xl">“{ABOUT_QUOTE.text}”</p>
        <cite className="mt-4 block text-sm font-semibold not-italic text-ink-subtle">
          {ABOUT_QUOTE.attribution}
        </cite>
      </blockquote>

      <div className="mt-12">
        <h2 className="font-display text-2xl text-ink">{ABOUT_TIMELINE.heading}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {ABOUT_TIMELINE.entries.map((entry) => (
            <div key={entry.year} className="rounded-xl border border-border bg-surface p-5 shadow-xs">
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-gold">{entry.year}</span>
              <h3 className="mt-2 font-display text-lg text-ink">{entry.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{entry.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={ROUTES.menu} className={CTA_PRIMARY_CLASSES}>
            {ABOUT_TIMELINE.ctaPrimary.label}
          </Link>
          <Link href={ROUTES.contact} className={CTA_SECONDARY_CLASSES}>
            {ABOUT_TIMELINE.ctaSecondary.label}
          </Link>
        </div>
      </div>
    </main>
  );
}
