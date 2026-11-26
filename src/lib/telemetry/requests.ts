/**
 * The HTTP requests, from the server span Next.js opens for each one (BaseServer.handleRequest,
 * named `GET /api/protected/article/[id]` once the route is known):
 *
 * - the metric `http.server.request.duration` (→ http_server_request_duration_seconds_*), with
 *   http.route, http.request.method and http.response.status_code. Next.js gives the spans but no
 *   metric, and the http instrumentation would count them without their route;
 * - the stable attributes on those spans (Next.js sets the old `http.method`, `http.status_code`);
 * - their registry for `user.id` (user.ts);
 * - one root span `<METHOD> <route>` per request, also behind proxy.ts (below).
 *
 * A request that proxy.ts matches (/protected, /api/protected) is served in two passes, each with
 * its server span: the first runs proxy.ts and ends without a route, the second, its child,
 * renders the route. The first one is held back until the second ends, then exported with the
 * second's name, route and status: the trace's root is `GET /api/protected/article/[id]`, not
 * `GET`, and the second is exported as INTERNAL, so that the request counts once. When no second pass comes (proxy.ts redirected to the login page), it is exported as is
 * after HOLD_MS, named `GET proxy.ts`.
 */
import { metrics, SpanKind, SpanStatusCode, type Context, type Histogram } from "@opentelemetry/api";
import {
  SamplingDecision,
  type ReadableSpan,
  type Sampler,
  type SamplingResult,
  type Span,
  type SpanProcessor,
} from "@opentelemetry/sdk-trace";
import { openRequests } from "./user";

const HANDLE_REQUEST = "BaseServer.handleRequest";

/** Neither traced nor counted: the probes, and the static files of the bundle. */
const UNTRACED = /^\/(health\/|_next\/static\/|_next\/image|favicon\.ico)/;

/** How long a proxy.ts pass waits for its route's pass: more than the slowest request. */
const HOLD_MS = 120_000;

function isRequest(span: { kind: SpanKind; attributes: Record<string, unknown> }) {
  return span.kind === SpanKind.SERVER && span.attributes["next.span_type"] === HANDLE_REQUEST;
}

/** Drops the request spans of UNTRACED paths, and their children with them (ParentBased). */
export class UntracedPathsSampler implements Sampler {
  shouldSample(_c: Context, _t: string, _n: string, kind: SpanKind, attributes: Record<string, unknown>): SamplingResult {
    const target = attributes["http.target"];
    if (kind === SpanKind.SERVER && typeof target === "string" && UNTRACED.test(target)) {
      return { decision: SamplingDecision.NOT_RECORD };
    }
    return { decision: SamplingDecision.RECORD_AND_SAMPLED };
  }
  toString() {
    return "UntracedPathsSampler";
  }
}

/** The span as exported, with another name and attributes (the span itself is already ended). */
function exportedAs(span: ReadableSpan, name: string, attributes: ReadableSpan["attributes"], status = span.status, kind = span.kind): ReadableSpan {
  return Object.create(span, {
    name: { value: name },
    attributes: { value: attributes },
    status: { value: status },
    kind: { value: kind },
  });
}

/** Wraps the processor that exports the spans (`next`). */
export class RequestSpanProcessor implements SpanProcessor {
  private histogram?: Histogram;
  private readonly held = new Map<string, { span: ReadableSpan; timer: NodeJS.Timeout }>();

  constructor(private readonly next: SpanProcessor) {}

  /** Created on first use: a meter taken before sdk.start() would be the no-op one. */
  private get duration(): Histogram {
    return (this.histogram ??= metrics.getMeter("dechets").createHistogram("http.server.request.duration", {
      unit: "s",
      description: "Duration of HTTP server requests.",
      advice: { explicitBucketBoundaries: [0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5, 10] },
    }));
  }

  onStart(span: Span, parentContext: Context): void {
    if (isRequest(span)) {
      const traceId = span.spanContext().traceId;
      const spans = openRequests.get(traceId) ?? new Set();
      spans.add(span);
      openRequests.set(traceId, spans);
      const method = span.attributes["http.method"];
      if (typeof method === "string") span.setAttribute("http.request.method", method);
      const target = span.attributes["http.target"];
      if (typeof target === "string") span.setAttribute("url.path", target.split("?")[0]);
    }
    this.next.onStart(span, parentContext);
  }

  onEnding(span: Span): void {
    if (isRequest(span)) {
      const status = span.attributes["http.status_code"];
      if (typeof status === "number") span.setAttribute("http.response.status_code", status);
    }
    this.next.onEnding?.(span);
  }

  onEnd(span: ReadableSpan): void {
    if (!isRequest(span)) {
      this.next.onEnd(span);
      return;
    }
    const { traceId, spanId } = span.spanContext();
    const spans = openRequests.get(traceId);
    if (spans) {
      for (const s of spans) if (s.spanContext().spanId === spanId) spans.delete(s);
      if (spans.size === 0) openRequests.delete(traceId);
    }

    const route = span.attributes["http.route"];
    if (typeof route !== "string") {
      this.hold(span);
      return;
    }

    const [s, ns] = span.duration;
    this.duration.record(s + ns / 1e9, {
      "http.route": route,
      "http.request.method": String(span.attributes["http.method"] ?? ""),
      "http.response.status_code": Number(span.attributes["http.status_code"] ?? 0),
    });

    const parentId = span.parentSpanContext?.spanId;
    const parent = parentId ? this.held.get(parentId) : undefined;
    if (parent && parentId) {
      clearTimeout(parent.timer);
      this.held.delete(parentId);
      const { "user.id": userId } = span.attributes;
      this.next.onEnd(
        exportedAs(parent.span, span.name, {
          ...parent.span.attributes,
          "http.route": route,
          "http.status_code": span.attributes["http.status_code"],
          "http.response.status_code": span.attributes["http.response.status_code"],
          ...(userId !== undefined && { "user.id": userId }),
        }, span.status.code === SpanStatusCode.ERROR ? span.status : parent.span.status),
      );
      // The route's pass under it, INTERNAL: one server span per request, as the plugin counts them.
      this.next.onEnd(exportedAs(span, span.name, span.attributes, span.status, SpanKind.INTERNAL));
      return;
    }
    this.next.onEnd(span);
  }

  /** A pass without a route: proxy.ts's, waiting for the route's (see top of file). */
  private hold(span: ReadableSpan): void {
    const { spanId } = span.spanContext();
    const timer = setTimeout(() => this.release(spanId), HOLD_MS);
    timer.unref();
    this.held.set(spanId, { span, timer });
  }

  /** No route's pass came: proxy.ts answered (a redirect), with a status Next.js doesn't give. */
  private release(spanId: string): void {
    const held = this.held.get(spanId);
    if (!held) return;
    clearTimeout(held.timer);
    this.held.delete(spanId);
    const { "http.status_code": _old, "http.response.status_code": _new, ...attributes } = held.span.attributes;
    this.next.onEnd(exportedAs(held.span, `${held.span.attributes["http.method"] ?? held.span.name} proxy.ts`, attributes));
  }

  forceFlush(): Promise<void> {
    return this.next.forceFlush();
  }

  shutdown(): Promise<void> {
    for (const spanId of [...this.held.keys()]) this.release(spanId);
    return this.next.shutdown();
  }
}
