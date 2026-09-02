import { getOptionalSession } from "@/modules/auth/lib/getOptionalSession";
import { getOrderById } from "@/modules/order/api";
import { authorizeOrderAccess } from "@/modules/order/lib/authorizeOrderAccess";
import { toOrderSummaryDTO } from "@/modules/order/lib/toOrderSummaryDTO";

/**
 * The actually-exposed, repeatedly-polled surface — re-runs
 * authorizeOrderAccess independently of whatever the confirmation page
 * already decided, since this route can be hit directly.
 */
export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  const order = await getOrderById(params.orderId);
  const sessionUser = await getOptionalSession();
  const sessionIdParam = new URL(req.url).searchParams.get("session_id");

  const access = order ? authorizeOrderAccess(order, sessionUser, sessionIdParam) : { allowed: false };
  if (!order || !access.allowed) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(toOrderSummaryDTO(order));
}
