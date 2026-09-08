import Image from "next/image";
import {
  CONTACT_ADDRESS,
  CONTACT_HEADER,
  CONTACT_HOURS,
  CONTACT_LINKS,
  CONTACT_MAP_PLACEHOLDER,
  CONTACT_PHOTO,
} from "../content/contactContent";

export function ContactScreen() {
  return (
    <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-8 md:py-12">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl text-ink">{CONTACT_HEADER.heading}</h1>
        <p className="mt-3 text-lg text-ink-muted">{CONTACT_HEADER.body}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-xs">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-xl text-ink">Hours</h2>
              <span className="rounded-pill bg-gold-soft px-3 py-1 text-xs font-semibold text-gold-hover">
                {CONTACT_HOURS.badge}
              </span>
            </div>
            <dl className="mt-4 space-y-2">
              {CONTACT_HOURS.rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <dt className="text-ink-muted">{row.label}</dt>
                  <dd className={row.muted ? "text-ink-subtle" : "font-semibold text-ink"}>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 shadow-xs">
            <h2 className="font-display text-xl text-ink">Address</h2>
            {CONTACT_ADDRESS.lines.map((line) => (
              <p key={line} className="mt-1 text-ink-muted">
                {line}
              </p>
            ))}
            <p className="mt-4 text-sm text-ink-subtle">{CONTACT_ADDRESS.gettingHere}</p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 shadow-xs">
            <h2 className="font-display text-xl text-ink">Get in touch</h2>
            <ul className="mt-4 space-y-2">
              {CONTACT_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="font-semibold text-ink hover:text-gold-hover">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-sunken p-8 text-center">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-subtle">
              {CONTACT_MAP_PLACEHOLDER.eyebrow}
            </span>
            <h2 className="mt-2 font-display text-xl text-ink">{CONTACT_MAP_PLACEHOLDER.title}</h2>
            <p className="mt-2 max-w-sm text-sm text-ink-muted">{CONTACT_MAP_PLACEHOLDER.note}</p>
            <a
              href={CONTACT_MAP_PLACEHOLDER.linkHref}
              target="_blank"
              rel="noreferrer"
              className="mt-4 rounded-pill border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-bg"
            >
              {CONTACT_MAP_PLACEHOLDER.linkLabel}
            </a>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sunken shadow-sm">
            <Image
              src={CONTACT_PHOTO.src}
              alt={CONTACT_PHOTO.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
