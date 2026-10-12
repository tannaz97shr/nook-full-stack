"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { ROUTES } from "@/shared/routes";
import { logError } from "@/shared/utils/log-error";
import { AUTH_DEMO_CONTENT } from "../content/authContent";
import type { DemoPersona } from "../lib/demoAccounts";

interface UseDemoSignInInput {
  callbackUrl?: string;
}

/** Sends only a persona name — the server resolves the account, and no password exists to send. */
export function useDemoSignIn({ callbackUrl }: UseDemoSignInInput) {
  const [pendingPersona, setPendingPersona] = useState<DemoPersona | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signInAs(persona: DemoPersona) {
    setPendingPersona(persona);
    setError(null);
    try {
      // MUST check result?.error, not .ok/.status — v5's credentials
      // callback returns HTTP 200 even on failed login.
      const result = await signIn("demo", { persona, redirect: false });
      if (result?.error) {
        throw new Error(`Demo sign-in rejected: ${result.error}`);
      }
      // Full page navigation so the new session cookie is picked up server-side.
      window.location.assign(persona === "admin" ? ROUTES.admin.orders : (callbackUrl ?? ROUTES.menu));
    } catch (signInError) {
      logError(signInError, "auth.demoSignIn", { level: "error" });
      setError(AUTH_DEMO_CONTENT.error);
      setPendingPersona(null);
    }
  }

  return { signInAs, pendingPersona, error };
}
