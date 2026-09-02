export default function MenuLoading() {
  return (
    <main className="mx-auto max-w-[1240px] px-4 pb-16 sm:px-8">
      <div className="my-8 h-9 w-40 animate-pulse rounded bg-sunken" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,272px),1fr))] gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="aspect-[4/3] animate-pulse bg-sunken" />
            <div className="space-y-2 px-[18px] py-4">
              <div className="h-5 w-2/3 animate-pulse rounded bg-sunken" />
              <div className="h-4 w-full animate-pulse rounded bg-sunken" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-sunken" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
