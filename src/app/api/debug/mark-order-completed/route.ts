import { requireAdminSession } from "@/modules/auth/lib/requireAdminSession";
import { awardPointsIfCompleted } from "@/modules/loyalty/api/awardPointsIfCompleted";
import { logError } from "@/shared/utils/log-error";

/**
 * QA-only route to exercise the Completed-transition points-award
 * transaction (awardPointsIfCompleted) directly — Phase 5b builds real
 * accrual logic but no admin fulfillment UI exists yet to transition
 * fulfillmentStatus to "Completed" for real. Delete once Phase 6 builds
 * one to exercise instead. See specs/known-issues.md.
 */
export async function POST(req: Request) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const body = await req.json().catch(() => null);
  const orderId = typeof body?.orderId === "string" ? body.orderId : null;
  if (!orderId) {
    return Response.json({ error: "orderId is required" }, { status: 400 });
  }

  try {
    const result = await awardPointsIfCompleted(orderId);
    return Response.json({ result });
  } catch (error) {
    logError(error, "debug.markOrderCompleted", { level: "error" });
    return Response.json({ error: "Could not mark order completed" }, { status: 500 });
  }
}
