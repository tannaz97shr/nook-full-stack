import { requireAdminSession } from "@/modules/auth/lib/requireAdminSession";
import { updateMenuItem } from "@/modules/menu/api";
import { menuItemInputSchema } from "@/modules/menu/lib/menuItemSchema";
import { MenuEntityNotFoundError } from "@/modules/menu/lib/errors";
import { logError } from "@/shared/utils/log-error";

export async function PATCH(req: Request, { params }: { params: { itemId: string } }) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const body = await req.json();
  const parsed = menuItemInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const menuItem = await updateMenuItem(params.itemId, parsed.data);
    return Response.json({ menuItem });
  } catch (error) {
    if (error instanceof MenuEntityNotFoundError) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }
    logError(error, "admin.menu.items.update", { level: "error" });
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
