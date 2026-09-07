import { getUsersByIds } from "@/modules/auth/api/getUsersByIds";
import { getAllOrders } from "@/modules/order/api";
import { AdminOrdersScreen } from "@/modules/order/components/AdminOrdersScreen";
import { computeAdminOrderStats } from "@/modules/order/lib/computeAdminOrderStats";
import { toAdminOrderQueueRow } from "@/modules/order/lib/toAdminOrderQueueRow";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  const userIds = orders.flatMap((order) => (order.userId ? [order.userId] : []));
  const usersById = await getUsersByIds(userIds);

  const rows = orders.map((order) =>
    toAdminOrderQueueRow(order, order.userId ? (usersById.get(order.userId)?.name ?? null) : null),
  );
  const stats = computeAdminOrderStats(orders);

  return <AdminOrdersScreen rows={rows} stats={stats} />;
}
