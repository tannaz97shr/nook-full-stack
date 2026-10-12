import { AuthScreen } from "@/modules/auth/components/AuthScreen";
import { AUTH_CALLBACK_PARAM } from "@/shared/routes";

interface SignUpPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function SignUpPage({ searchParams }: SignUpPageProps) {
  const callbackUrl = searchParams[AUTH_CALLBACK_PARAM];

  return (
    <AuthScreen mode="sign-up" callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined} />
  );
}
