import type { Role } from "./user";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}
