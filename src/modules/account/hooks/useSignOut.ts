"use client";

import { useState } from "react";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { useToast } from "@/shared/hooks/useToast";
import { ROUTES } from "@/shared/routes";
import { logError } from "@/shared/utils/log-error";
import { SIGN_OUT_ERROR } from "../content/accountContent";

/**
 * Shared by every sign-out control. signOut() is a CSRF fetch + POST +
 * redirect, which can take a few seconds on a slow connection —
 * isSigningOut lets the caller show that the click registered instead of
 * looking dead (and inviting a second click).
 */
export function useSignOut(context: string) {
  const { showToast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    try {
      await nextAuthSignOut({ callbackUrl: ROUTES.home });
    } catch (error) {
      logError(error, context, { level: "error" });
      showToast(SIGN_OUT_ERROR, "error");
      setIsSigningOut(false);
    }
  }

  return { signOut, isSigningOut };
}
