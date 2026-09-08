import { getAllRewards } from "@/modules/loyalty/api";
import { AdminLoyaltyScreen } from "@/modules/loyalty/components/AdminLoyaltyScreen";

export default async function AdminLoyaltyPage() {
  const rewards = await getAllRewards();
  return <AdminLoyaltyScreen rewards={rewards} />;
}
