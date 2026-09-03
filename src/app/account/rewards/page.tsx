import { redirect } from "next/navigation";
import { getUserByEmail } from "@/modules/auth/api";
import { requireSession } from "@/modules/auth/lib/requireSession";
import { computeRewardsStats } from "@/modules/loyalty/lib/computeRewardsStats";
import { getOrdersByUserId } from "@/modules/order/api";
import { RewardsShell } from "@/modules/account/components/RewardsShell";
import { ROUTES, signInWithCallback } from "@/shared/routes";

export default async function AccountRewardsPage() {
  const guard = await requireSession();
  if ("error" in guard) {
    redirect(signInWithCallback(ROUTES.account.rewards));
  }

  const [user, orders] = await Promise.all([
    getUserByEmail(guard.session.user.id),
    getOrdersByUserId(guard.session.user.id),
  ]);

  return <RewardsShell pointsBalance={user?.pointsBalance ?? 0} stats={computeRewardsStats(orders)} />;
}
