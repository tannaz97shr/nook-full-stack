import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireSession } from "@/modules/auth/lib/requireSession";
import { getUserByEmail } from "@/modules/auth/api";
import { AccountShell } from "@/modules/account/components/AccountShell";
import { ROUTES, signInWithCallback } from "@/shared/routes";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const guard = await requireSession();
  if ("error" in guard) {
    redirect(signInWithCallback(ROUTES.account.root));
  }

  const user = await getUserByEmail(guard.session.user.id);
  if (!user) {
    // Defensive: a valid session cookie but no matching user doc shouldn't happen in practice.
    redirect(signInWithCallback(ROUTES.account.root));
  }

  return (
    <>
      <AccountShell user={user} />
      <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-8">{children}</main>
    </>
  );
}
