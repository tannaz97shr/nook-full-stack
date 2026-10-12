"use client";

import { Button } from "@/shared/components";
import { useHasMounted } from "@/shared/hooks/useHasMounted";
import { AUTH_DEMO_CONTENT } from "../content/authContent";
import { useDemoSignIn } from "../hooks/useDemoSignIn";

export interface DemoSignInPanelProps {
  callbackUrl?: string;
}

/** One-click sign-in to the seeded demo accounts. Rendered only when the server says DEMO_ACCESS_ENABLED. */
export function DemoSignInPanel({ callbackUrl }: DemoSignInPanelProps) {
  const { signInAs, pendingPersona, error } = useDemoSignIn({ callbackUrl });
  // Server-rendered, so keep the buttons pending until onClick is attached.
  const hasMounted = useHasMounted();
  const isBusy = !hasMounted || pendingPersona !== null;

  return (
    <section className="mb-[26px] rounded-xl border border-border bg-sunken p-4">
      <h2 className="text-[15px] font-bold text-ink">{AUTH_DEMO_CONTENT.heading}</h2>
      <p className="mb-3 mt-1 text-[13.5px] leading-relaxed text-ink-muted">{AUTH_DEMO_CONTENT.blurb}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" variant="secondary" pending={isBusy} onClick={() => signInAs("customer")}>
          {pendingPersona === "customer" ? AUTH_DEMO_CONTENT.pending : AUTH_DEMO_CONTENT.customerCta}
        </Button>
        <Button type="button" variant="secondary" pending={isBusy} onClick={() => signInAs("admin")}>
          {pendingPersona === "admin" ? AUTH_DEMO_CONTENT.pending : AUTH_DEMO_CONTENT.adminCta}
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-clay">
          {error}
        </p>
      )}
    </section>
  );
}
