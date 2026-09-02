"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/shared/components";
import { ROUTES } from "@/shared/routes";
import { SIGN_OUT_LABEL } from "../content/accountContent";

export function SignOutButton() {
  return (
    <Button variant="secondary" onClick={() => signOut({ callbackUrl: ROUTES.home })}>
      {SIGN_OUT_LABEL}
    </Button>
  );
}
