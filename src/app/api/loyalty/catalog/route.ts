import { getActiveRewards } from "@/modules/loyalty/api";
import { logError } from "@/shared/utils/log-error";

/** Public — catalog display isn't sensitive. Always filters to isActive server-side; never accepts a client-supplied status. */
export async function GET() {
  try {
    const rewards = await getActiveRewards();
    return Response.json({ rewards });
  } catch (error) {
    logError(error, "loyalty.catalog", { level: "error" });
    return Response.json({ error: "Could not load rewards" }, { status: 500 });
  }
}
