import { requireAdminSession } from "@/modules/auth/lib/requireAdminSession";
import { updateCategory } from "@/modules/menu/api";
import { categoryInputSchema } from "@/modules/menu/lib/categorySchema";
import { MenuEntityNotFoundError } from "@/modules/menu/lib/errors";
import { logError } from "@/shared/utils/log-error";

export async function PATCH(req: Request, { params }: { params: { categoryId: string } }) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const body = await req.json();
  const parsed = categoryInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const category = await updateCategory(params.categoryId, parsed.data);
    return Response.json({ category });
  } catch (error) {
    if (error instanceof MenuEntityNotFoundError) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }
    logError(error, "admin.menu.categories.update", { level: "error" });
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
