import { z } from "zod";
import { requireAdminSession } from "@/modules/auth/lib/requireAdminSession";
import { awardPointsIfCompleted } from "@/modules/loyalty/api/awardPointsIfCompleted";
import { advanceFulfillmentStatus } from "@/modules/order/api";
import { logError } from "@/shared/utils/log-error";

/** "Received" is never a PATCH target — it's set automatically by markOrderPaidIfUnprocessed. */
const orderStatusUpdateSchema = z.object({ status: z.enum(["Preparing", "Ready", "Completed"]) });

/**
 * Completed goes through awardPointsIfCompleted directly — the exact same
 * transaction Phase 5b built and its now-retired debug route exercised —
 * since that function both flips fulfillmentStatus and credits points
 * atomically. Preparing/Ready go through the narrower
 * advanceFulfillmentStatus, which only ever flips the status field.
 *
 * Idempotent-retry results ("already-awarded", "already-at-target") are
 * treated as success (200), not errors — a double-click or retried
 * request must never surface as a failure to the admin.
 */
export async function PATCH(req: Request, { params }: { params: { orderId: string } }) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const body = await req.json();
  const parsed = orderStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    if (parsed.data.status === "Completed") {
      const result = await awardPointsIfCompleted(params.orderId);
      switch (result) {
        case "awarded":
        case "already-awarded":
        case "guest-order":
          return Response.json({ result });
        case "not-paid":
          return Response.json({ error: "Order is not paid" }, { status: 409 });
        case "not-found":
          return Response.json({ error: "Order not found" }, { status: 404 });
      }
    }

    const result = await advanceFulfillmentStatus(params.orderId, parsed.data.status);
    switch (result) {
      case "advanced":
      case "already-at-target":
        return Response.json({ result });
      case "not-found":
        return Response.json({ error: "Order not found" }, { status: 404 });
      case "not-paid":
        return Response.json({ error: "Order is not paid" }, { status: 409 });
      case "invalid-transition":
        return Response.json({ error: "Cannot advance to that status right now" }, { status: 409 });
    }
  } catch (error) {
    logError(error, "admin.orders.status", { level: "error" });
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
