import { z } from "zod";
import { requireAdminSession } from "@/modules/auth/lib/requireAdminSession";
import { setMenuItemAvailability } from "@/modules/menu/api";
import { MenuEntityNotFoundError } from "@/modules/menu/lib/errors";
import { logError } from "@/shared/utils/log-error";

const availabilitySchema = z.object({ isAvailable: z.boolean() });

/** The 86-toggle's endpoint — not reused by an RHF form, so its schema stays local rather than in lib/. */
export async function PATCH(req: Request, { params }: { params: { itemId: string } }) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const body = await req.json();
  const parsed = availabilitySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    await setMenuItemAvailability(params.itemId, parsed.data.isAvailable);
    return Response.json({});
  } catch (error) {
    if (error instanceof MenuEntityNotFoundError) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }
    logError(error, "admin.menu.items.availability", { level: "error" });
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
