import { HOME_VALUES } from "../content/homeContent";

export function ValuesSection() {
  return (
    <section className="mt-7 border-y border-border bg-sunken md:mt-11">
      <div className="mx-auto max-w-page px-4 py-11 sm:px-8 md:py-20">
        <h2 className="mb-7 max-w-md font-display text-3xl font-medium tracking-tight text-ink md:mb-12 md:text-4xl">
          {HOME_VALUES.heading}
        </h2>
        <div className="grid gap-6 md:grid-cols-3 md:gap-10">
          {HOME_VALUES.items.map((value, index) => (
            <div
              key={value.number}
              className={`border-t-2 pt-5 ${index === 0 ? "border-gold" : "border-border-strong"}`}
            >
              <span className="mb-3.5 block font-mono text-xs text-gold">{value.number}</span>
              <h3 className="mb-2.5 font-display text-2xl font-medium text-ink">{value.title}</h3>
              <p className="text-sm text-ink-muted md:text-base">{value.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
