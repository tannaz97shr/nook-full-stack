import { AuthScreen } from "@/modules/auth/components/AuthScreen";
import { getAuthUrlErrorMessage } from "@/modules/auth/content/authContent";
import { AUTH_CALLBACK_PARAM } from "@/shared/routes";

interface SignInPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  const callbackUrl = searchParams[AUTH_CALLBACK_PARAM];
  const errorCode = searchParams.error;

  return (
    <AuthScreen
      mode="sign-in"
      callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined}
      errorMessage={getAuthUrlErrorMessage(typeof errorCode === "string" ? errorCode : undefined)}
    />
  );
}
