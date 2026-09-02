import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import {
  ROUTES,
  PROTECTED_ROUTE_PREFIXES,
  ADMIN_ROUTE_PREFIX,
  signInWithCallback,
} from "@/shared/routes";

/**
 * Named middleware.ts, not proxy.ts: CLAUDE.md describes "proxy.ts (Next's
 * renamed middleware)", but that rename shipped in Next.js 16.0 and this
 * repo is pinned to 14.2.4, which only recognizes middleware.ts. A file
 * literally named proxy.ts would be silently ignored here. Rename this
 * file (and this comment) if/when the project upgrades to Next 16.
 *
 * Its own lightweight, provider-less NextAuth(authConfig) instance — never
 * import "@/auth" here, it pulls in firebase-admin/bcryptjs, which fail to
 * bundle under the edge runtime. Matcher below excludes /api entirely, so
 * every relevant API route must self-check via requireSession()/
 * requireAdminSession().
 */
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAdmin = pathname.startsWith(ADMIN_ROUTE_PREFIX);

  if (!req.auth && (isProtected || isAdmin)) {
    return NextResponse.redirect(new URL(signInWithCallback(pathname), req.nextUrl));
  }

  if (isAdmin && req.auth?.user.role !== "admin") {
    return NextResponse.redirect(new URL(ROUTES.home, req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
