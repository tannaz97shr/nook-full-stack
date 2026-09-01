"use client";

import { useEffect } from "react";
import { ErrorState } from "@/shared/components/organisms/ErrorState";
import { ERROR_CONTENT } from "@/shared/content/error-content";
import { logError } from "@/shared/utils/log-error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, "root-error-boundary", { level: "error" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <ErrorState
        {...ERROR_CONTENT.boundary}
        digest={error.digest}
        onAction={reset}
      />
    </div>
  );
}
