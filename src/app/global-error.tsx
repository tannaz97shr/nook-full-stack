"use client";

import { useEffect } from "react";
import { ErrorState } from "@/shared/components/organisms/ErrorState";
import { ERROR_CONTENT } from "@/shared/content/error-content";
import { THEME_INIT_SCRIPT } from "@/shared/utils/theme";
import { logError } from "@/shared/utils/log-error";
import "./globals.css";

// Replaces the root layout entirely, so it renders its own <html>/<body> and
// re-imports globals.css. It skips the next/font loaders on purpose — the
// tailwind.config.ts font fallbacks (declared inside var(...)) keep text
// legible without them. It also re-runs the theme bootstrap script (as the
// first child of <body>, since <head> isn't reliably ownable here) — worst
// case is a sub-frame flash on an already-broken page.
//
// This mostly won't fire in `next dev` (the dev overlay intercepts) —
// verify via `bun run build && bun run start`.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, "global-error-boundary", { level: "error" });
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <ErrorState
            {...ERROR_CONTENT.global}
            digest={error.digest}
            onAction={reset}
          />
        </div>
      </body>
    </html>
  );
}
