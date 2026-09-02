import type { Role } from "./user";
import type { SessionUser } from "./session-user";

/**
 * Augmented at the actual declaration site (@auth/core/types,
 * @auth/core/jwt), not "next-auth"/"next-auth/jwt" — those only re-export
 * via `export *`/`export type {}`, which TS declaration merging does not
 * follow, so augmenting them silently no-ops.
 */
declare module "@auth/core/types" {
  interface User {
    id: string;
    role: Role;
  }

  interface Session {
    user: SessionUser;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
