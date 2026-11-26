/**
 * Log lines in pino's JSON format, the one Loki and the « Erreurs » tab read: numeric level,
 * time in ms, msg, err { type, message, stack }, and the trace of the request being served.
 * Only when LOG_FORMAT=json (set by the image): in dev, logs stay plain text.
 */
import { trace } from "@opentelemetry/api";
import { format } from "node:util";

export const jsonLogs = process.env.LOG_FORMAT === "json";

export const LEVELS = { trace: 10, debug: 20, info: 30, warn: 40, error: 50, fatal: 60 } as const;
export type Level = keyof typeof LEVELS;

type ErrField = { type: string; message: string; stack?: string };

function errField(err: unknown): ErrField | undefined {
  if (err instanceof Error) {
    return { type: err.constructor?.name && err.constructor.name !== "Object" ? err.constructor.name : err.name, message: err.message, stack: err.stack };
  }
  if (err === undefined || err === null) return undefined;
  return { type: "Error", message: String(err) };
}

/** One JSON line on stdout. */
export function writeJson(level: Level, msg: string, err?: unknown): void {
  const line: Record<string, unknown> = { level: LEVELS[level], time: Date.now(), msg };
  const e = errField(err);
  if (e) line.err = e;
  const span = trace.getActiveSpan()?.spanContext();
  if (span && span.traceId !== "00000000000000000000000000000000") {
    line.trace_id = span.traceId;
    line.span_id = span.spanId;
  }
  process.stdout.write(JSON.stringify(line) + "\n");
}

const NODE_WARNING = /^\(node:\d+\) (\[\w+\] )?\w*Warning:/;

/**
 * console.* as JSON lines, Next.js's own messages included (an error thrown by a route is
 * written by Next with console.error): the first Error among the arguments becomes `err`.
 */
export function jsonConsole(): void {
  const methods: [keyof Console, Level][] = [
    ["debug", "debug"], ["log", "info"], ["info", "info"], ["warn", "warn"], ["error", "error"],
  ];
  for (const [method, level] of methods) {
    (console as unknown as Record<string, unknown>)[method] = (...args: unknown[]) => {
      const err = args.find((a) => a instanceof Error);
      const rest = args.filter((a) => a !== err);
      const msg = rest.length ? format(...rest) : err instanceof Error ? err.message : "";
      // Node's own warnings ("(node:1) [DEP0123] DeprecationWarning: …") go through console.error:
      // a warning, not an error of the app's « Erreurs » tab.
      writeJson(level === "error" && NODE_WARNING.test(msg) ? "warn" : level, msg, err);
    };
  }
}
