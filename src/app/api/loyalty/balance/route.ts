import { getUserByEmail } from "@/modules/auth/api";
import { requireSession } from "@/modules/auth/lib/requireSession";
import { logError } from "@/shared/utils/log-error";

export async function GET() {
  const guard = await requireSession();
  if ("error" in guard) return guard.error;

  try {
    const user = await getUserByEmail(guard.session.user.id); // doc id === lowercase email === SessionUser.id
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    return Response.json({ pointsBalance: user.pointsBalance });
  } catch (error) {
    logError(error, "loyalty.balance", { level: "error" });
    return Response.json({ error: "Could not load points balance" }, { status: 500 });
  }
}
