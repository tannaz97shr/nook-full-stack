import { registerCredentialsUser } from "@/modules/auth/api";
import { registerSchema } from "@/modules/auth/lib/credentialsSchema";
import { EmailAlreadyRegisteredError } from "@/modules/auth/lib/errors";
import { logError } from "@/shared/utils/log-error";

/** Credentials-only sign-up. Google users are provisioned in auth.ts's signIn() callback instead. */
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();

  try {
    const user = await registerCredentialsUser({
      email,
      name: parsed.data.name,
      password: parsed.data.password,
    });
    return Response.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof EmailAlreadyRegisteredError) {
      return Response.json({ error: "Email already registered" }, { status: 409 });
    }
    logError(error, "auth.register", { level: "error" });
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
