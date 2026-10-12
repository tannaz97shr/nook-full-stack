import { notFound } from "next/navigation";
import { getOptionalSession } from "@/modules/auth/lib/getOptionalSession";
import { getOrderById } from "@/modules/order/api";
import { OrderConfirmationScreen } from "@/modules/order/components/OrderConfirmationScreen";
import { authorizeOrderAccess } from "@/modules/order/lib/authorizeOrderAccess";
import { toOrderSummaryDTO } from "@/modules/order/lib/toOrderSummaryDTO";

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: { session_id?: string };
}) {
  const sessionIdParam = searchParams.session_id ?? null;
  const order = await getOrderById(params.orderId);
  const sessionUser = await getOptionalSession();

  const access = order
    ? authorizeOrderAccess(order, sessionUser, sessionIdParam)
    : { allowed: false, shouldPoll: false };

  if (!order || !access.allowed) {
    notFound();
  }

  return (
    <OrderConfirmationScreen
      orderId={order.id}
      initialOrder={toOrderSummaryDTO(order)}
      sessionId={sessionIdParam}
      shouldPoll={access.shouldPoll}
    />
  );
}
