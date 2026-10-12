import { redirect } from "next/navigation";
import { getUsersByIds } from "@/modules/auth/api/getUsersByIds";
import { requireSession } from "@/modules/auth/lib/requireSession";
import { getAllOrders } from "@/modules/order/api";
import { AdminOrdersScreen } from "@/modules/order/components/AdminOrdersScreen";
import { computeAdminOrderStats } from "@/modules/order/lib/computeAdminOrderStats";
import { filterOrdersForAdminView } from "@/modules/order/lib/filterOrdersForAdminView";
import { toAdminOrderQueueRow } from "@/modules/order/lib/toAdminOrderQueueRow";
import { ROUTES } from "@/shared/routes";

export default async function AdminOrdersPage() {
  // admin/layout.tsx already gates this page; the role is needed here only to pick which orders to show.
  const guard = await requireSession();
  if ("error" in guard) redirect(ROUTES.home);

  const orders = filterOrdersForAdminView(await getAllOrders(), guard.session.user.role);
  const userIds = orders.flatMap((order) => (order.userId ? [order.userId] : []));
  const usersById = await getUsersByIds(userIds);

  const rows = orders.map((order) =>
    toAdminOrderQueueRow(order, order.userId ? (usersById.get(order.userId)?.name ?? null) : null),
  );
  const stats = computeAdminOrderStats(orders);

  return <AdminOrdersScreen rows={rows} stats={stats} />;
}
