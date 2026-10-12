import { ADMIN_LOADING_LABEL } from "../content/adminLoadingContent";

const ROW_COUNT = 6;

/**
 * Rendered by each admin route's loading.tsx. Admin pages read Firestore
 * on the server, so a route change can take a few seconds — this commits
 * immediately (shell and active nav pill included) instead of the old
 * page sitting there unchanged.
 */
export function AdminPageSkeleton() {
  return (
    <div role="status" className="grid gap-5">
      <span className="sr-only">{ADMIN_LOADING_LABEL}</span>
      <div className="grid gap-2">
        <div className="h-8 w-48 animate-pulse rounded bg-sunken" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-sunken" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        {Array.from({ length: ROW_COUNT }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 border-b border-border px-[17px] py-4 last:border-b-0">
            <div className="h-4 w-1/4 animate-pulse rounded bg-sunken" />
            <div className="h-4 flex-1 animate-pulse rounded bg-sunken" />
            <div className="h-6 w-[42px] animate-pulse rounded-pill bg-sunken" />
          </div>
        ))}
      </div>
    </div>
  );
}
