import axios from "axios";

/**
 * Machine-readable code on the 403 requireAdminSession() returns to a
 * demo-admin, so the client can tell "read-only demo" apart from a plain
 * Forbidden and show friendly copy instead of a generic error.
 */
export const DEMO_READ_ONLY_CODE = "demo-read-only";

export function isDemoReadOnlyError(error: unknown): boolean {
  if (!axios.isAxiosError(error) || error.response?.status !== 403) return false;
  const data = error.response.data as { code?: string } | undefined;
  return data?.code === DEMO_READ_ONLY_CODE;
}
