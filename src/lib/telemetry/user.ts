/**
 * `user.id` (the login, never anything typed in) on the request spans of the current trace:
 * the « Utilisateurs » tab and the « utilisateurs touchés » of an error.
 *
 * The open request spans are kept by RequestSpanProcessor (requests.ts) in a registry on
 * globalThis: the routes' bundles don't share their modules with instrumentation.ts. Without
 * OpenTelemetry the registry stays empty and setUserId does nothing.
 */
import { trace, type Span } from "@opentelemetry/api";

type Registry = Map<string, Set<Span>>;
const KEY = Symbol.for("dechets.telemetry.openRequests");
const g = globalThis as unknown as Record<symbol, Registry | undefined>;

/** The request spans still open, by trace id. */
export const openRequests: Registry = (g[KEY] ??= new Map());

export function setUserId(userId: string): void {
  const traceId = trace.getActiveSpan()?.spanContext().traceId;
  if (!traceId) return;
  for (const span of openRequests.get(traceId) ?? []) span.setAttribute("user.id", userId.trim());
}
