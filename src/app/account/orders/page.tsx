import { redirect } from "next/navigation";
import { requireSession } from "@/modules/auth/lib/requireSession";
import { getOrdersByUserId } from "@/modules/order/api";
import { toOrderSummaryDTO } from "@/modules/order/lib/toOrderSummaryDTO";
import { OrderHistoryList } from "@/modules/account/components/OrderHistoryList";
import { ROUTES, signInWithCallback } from "@/shared/routes";

export default async function AccountOrdersPage() {
  const guard = await requireSession();
  if ("error" in guard) {
    redirect(signInWithCallback(ROUTES.account.orders));
  }

  const orders = await getOrdersByUserId(guard.session.user.id);

  return <OrderHistoryList orders={orders.map(toOrderSummaryDTO)} />;
}
