import { z } from "zod";
import { requireAdminSession } from "@/modules/auth/lib/requireAdminSession";
import { setRewardActive } from "@/modules/loyalty/api";
import { RewardNotFoundError } from "@/modules/loyalty/lib/errors";
import { logError } from "@/shared/utils/log-error";

const activeSchema = z.object({ isActive: z.boolean() });

/** The active-toggle's endpoint — not reused by an RHF form, so its schema stays local rather than in lib/. */
export async function PATCH(req: Request, { params }: { params: { rewardId: string } }) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const body = await req.json();
  const parsed = activeSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    await setRewardActive(params.rewardId, parsed.data.isActive);
    return Response.json({});
  } catch (error) {
    if (error instanceof RewardNotFoundError) {
      return Response.json({ error: "Reward not found" }, { status: 404 });
    }
    logError(error, "admin.loyalty.rewards.active", { level: "error" });
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
