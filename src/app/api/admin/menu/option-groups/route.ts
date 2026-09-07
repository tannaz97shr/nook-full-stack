import { requireAdminSession } from "@/modules/auth/lib/requireAdminSession";
import { createOptionGroup } from "@/modules/menu/api";
import { optionGroupInputSchema } from "@/modules/menu/lib/optionGroupSchema";
import { DuplicateSlugError } from "@/modules/menu/lib/errors";
import { logError } from "@/shared/utils/log-error";

export async function POST(req: Request) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const body = await req.json();
  const parsed = optionGroupInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const optionGroup = await createOptionGroup(parsed.data);
    return Response.json({ optionGroup }, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateSlugError) {
      return Response.json({ error: "An option group with that name already exists" }, { status: 409 });
    }
    logError(error, "admin.menu.optionGroups.create", { level: "error" });
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
