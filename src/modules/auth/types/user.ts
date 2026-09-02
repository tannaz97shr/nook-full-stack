export type Role = "customer" | "admin";
export type AuthProvider = "credentials" | "google";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: Role;
  authProvider: AuthProvider;
  createdAt: number;
  updatedAt: number;
}
