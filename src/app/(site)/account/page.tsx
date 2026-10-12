import { redirect } from "next/navigation";
import { requireSession } from "@/modules/auth/lib/requireSession";
import { getUserByEmail } from "@/modules/auth/api";
import { SavedDetailsCard } from "@/modules/account/components/SavedDetailsCard";
import { ROUTES, signInWithCallback } from "@/shared/routes";

export default async function AccountPage() {
  const guard = await requireSession();
  if ("error" in guard) {
    redirect(signInWithCallback(ROUTES.account.root));
  }

  const user = await getUserByEmail(guard.session.user.id);
  if (!user) {
    redirect(signInWithCallback(ROUTES.account.root));
  }

  return <SavedDetailsCard user={user} />;
}
