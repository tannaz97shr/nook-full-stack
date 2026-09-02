import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { getUserByEmail, getPasswordHashByEmail, upsertGoogleUser } from "@/modules/auth/api";
import { credentialsSchema } from "@/modules/auth/lib/credentialsSchema";
import { toSessionUser } from "@/modules/auth/lib/toSessionUser";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google,
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase().trim();
        const user = await getUserByEmail(email);
        if (!user || user.authProvider !== "credentials") return null;

        const hash = await getPasswordHashByEmail(email);
        if (!hash) return null;

        const valid = await bcrypt.compare(parsed.data.password, hash);
        if (!valid) return null;

        return toSessionUser(user);
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      // Credentials is already fully validated in authorize() above.
      if (account?.provider !== "google") return true;

      const email = user.email?.toLowerCase().trim();
      if (!email) return false;

      const result = await upsertGoogleUser({ email, name: user.name ?? "Nook Customer" });
      if (!result) return false; // provider collision — no auto-linking

      user.id = result.id;
      user.role = result.role;
      return true;
    },
  },
});
