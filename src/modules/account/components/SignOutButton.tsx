"use client";

import { Button } from "@/shared/components";
import { useHasMounted } from "@/shared/hooks/useHasMounted";
import { SIGN_OUT_LABEL } from "../content/accountContent";
import { useSignOut } from "../hooks/useSignOut";

export function SignOutButton() {
  const { signOut, isSigningOut } = useSignOut("SignOutButton.signOut");
  // Server-rendered inside AccountShell, so it's visible before React has
  // attached onClick — a click in that gap silently does nothing. Keep it
  // pending until mounted, same as the menu add buttons.
  const hasMounted = useHasMounted();

  return (
    <Button variant="secondary" pending={!hasMounted || isSigningOut} onClick={signOut}>
      {SIGN_OUT_LABEL}
    </Button>
  );
}
