import { requireAdminSession } from "@/modules/auth/lib/requireAdminSession";
import { updateOptionGroup } from "@/modules/menu/api";
import { optionGroupInputSchema } from "@/modules/menu/lib/optionGroupSchema";
import { MenuEntityNotFoundError } from "@/modules/menu/lib/errors";
import { logError } from "@/shared/utils/log-error";

export async function PATCH(req: Request, { params }: { params: { groupId: string } }) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const body = await req.json();
  const parsed = optionGroupInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const optionGroup = await updateOptionGroup(params.groupId, parsed.data);
    return Response.json({ optionGroup });
  } catch (error) {
    if (error instanceof MenuEntityNotFoundError) {
      return Response.json({ error: "Option group not found" }, { status: 404 });
    }
    logError(error, "admin.menu.optionGroups.update", { level: "error" });
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
