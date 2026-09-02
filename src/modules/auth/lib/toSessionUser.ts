import type { SessionUser } from "../types/session-user";
import type { User } from "../types/user";

/**
 * Narrows an already-mapped User to the shape that rides in the JWT
 * cookie. Takes a User, not a DocumentSnapshot, since by the time this is
 * called (inside authorize()/signIn()) a full User is already in hand —
 * this is a pure narrowing step, not a second Firestore read.
 */
export function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
