import { requireAdminSession } from "@/modules/auth/lib/requireAdminSession";
import { createReward } from "@/modules/loyalty/api";
import { rewardInputSchema } from "@/modules/loyalty/lib/rewardSchema";
import { DuplicateSlugError } from "@/modules/loyalty/lib/errors";
import { logError } from "@/shared/utils/log-error";

export async function POST(req: Request) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const body = await req.json();
  const parsed = rewardInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const reward = await createReward(parsed.data);
    return Response.json({ reward }, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateSlugError) {
      return Response.json({ error: "A reward with that name already exists" }, { status: 409 });
    }
    logError(error, "admin.loyalty.rewards.create", { level: "error" });
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
