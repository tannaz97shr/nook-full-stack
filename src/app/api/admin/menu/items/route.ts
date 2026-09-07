import { requireAdminSession } from "@/modules/auth/lib/requireAdminSession";
import { createMenuItem } from "@/modules/menu/api";
import { menuItemInputSchema } from "@/modules/menu/lib/menuItemSchema";
import { DuplicateSlugError } from "@/modules/menu/lib/errors";
import { logError } from "@/shared/utils/log-error";

export async function POST(req: Request) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const body = await req.json();
  const parsed = menuItemInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const menuItem = await createMenuItem(parsed.data);
    return Response.json({ menuItem }, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateSlugError) {
      return Response.json({ error: "An item with that name already exists" }, { status: 409 });
    }
    logError(error, "admin.menu.items.create", { level: "error" });
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
