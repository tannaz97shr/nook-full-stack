type LogLevel = "error" | "warn";

interface LogErrorOptions {
  level: LogLevel;
}

/**
 * Every catch block should log AND set visible UI state (see CLAUDE.md) —
 * this is the single logging entry point so that convention stays uniform.
 * Server-side integration (e.g. an external log sink) is a Phase 2+ concern;
 * for now this normalizes to console output.
 */
export function logError(
  error: unknown,
  context: string,
  { level }: LogErrorOptions,
): void {
  const method = level === "warn" ? console.warn : console.error;
  method(`[${context}]`, error);
}
