import type { NextAuthConfig } from "next-auth";
import { ROUTES } from "@/shared/routes";

/**
 * Edge-safe shared config: no bcryptjs, no firebase-admin import — same
 * node-only-API boundary firebase-admin.ts's own header comment warns
 * about, just at the edge runtime instead of the Client Component
 * boundary. Consumed both by the full auth.ts (Node) and by
 * middleware.ts's own lightweight NextAuth(authConfig) instance (edge).
 *
 * Holds both jwt() and session(): jwt() must live here too, not just
 * session(), because it runs on every request inside middleware's
 * instance to shape the token before session() reads it. It stays
 * edge-safe because it only ever copies fields off `user` when present —
 * no I/O. The actual Firestore lookups happen once, in auth.ts's Node-only
 * authorize()/signIn(), whose result is what `user` carries into jwt() on
 * that first call.
 */
export const authConfig = {
  pages: {
    signIn: ROUTES.signIn,
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
