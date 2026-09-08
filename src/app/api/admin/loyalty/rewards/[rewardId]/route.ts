import { requireAdminSession } from "@/modules/auth/lib/requireAdminSession";
import { updateReward } from "@/modules/loyalty/api";
import { rewardInputSchema } from "@/modules/loyalty/lib/rewardSchema";
import { RewardNotFoundError } from "@/modules/loyalty/lib/errors";
import { logError } from "@/shared/utils/log-error";

export async function PATCH(req: Request, { params }: { params: { rewardId: string } }) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const body = await req.json();
  const parsed = rewardInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const reward = await updateReward(params.rewardId, parsed.data);
    return Response.json({ reward });
  } catch (error) {
    if (error instanceof RewardNotFoundError) {
      return Response.json({ error: "Reward not found" }, { status: 404 });
    }
    logError(error, "admin.loyalty.rewards.update", { level: "error" });
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
