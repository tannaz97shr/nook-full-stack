import { requireAdminSession } from "@/modules/auth/lib/requireAdminSession";
import { createCategory } from "@/modules/menu/api";
import { categoryInputSchema } from "@/modules/menu/lib/categorySchema";
import { DuplicateSlugError } from "@/modules/menu/lib/errors";
import { logError } from "@/shared/utils/log-error";

export async function POST(req: Request) {
  const guard = await requireAdminSession();
  if ("error" in guard) return guard.error;

  const body = await req.json();
  const parsed = categoryInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const category = await createCategory(parsed.data);
    return Response.json({ category }, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateSlugError) {
      return Response.json({ error: "A category with that name already exists" }, { status: 409 });
    }
    logError(error, "admin.menu.categories.create", { level: "error" });
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
