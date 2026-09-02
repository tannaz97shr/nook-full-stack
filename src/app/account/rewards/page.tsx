import { redirect } from "next/navigation";
import { requireSession } from "@/modules/auth/lib/requireSession";
import { RewardsShell } from "@/modules/account/components/RewardsShell";
import { ROUTES, signInWithCallback } from "@/shared/routes";

export default async function AccountRewardsPage() {
  const guard = await requireSession();
  if ("error" in guard) {
    redirect(signInWithCallback(ROUTES.account.rewards));
  }

  return <RewardsShell />;
}
