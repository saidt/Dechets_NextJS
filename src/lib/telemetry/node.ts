/**
 * OpenTelemetry of the Node server, loaded by instrumentation.ts before any request
 * (docs/telemetrie.md, contract: infra/monitoring, docs/brancher-une-app.md).
 *
 * Nothing is exported without OTEL_EXPORTER_OTLP_ENDPOINT (dev, local docker): the app stays as
 * it is. The endpoint, OTEL_SERVICE_NAME, OTEL_RESOURCE_ATTRIBUTES (service.version,
 * deployment.environment.name) and OTEL_METRIC_EXPORT_INTERVAL come from the Helm chart.
 */
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { BatchSpanProcessor, ParentBasedSampler } from "@opentelemetry/sdk-trace";
import { RuntimeNodeInstrumentation } from "@opentelemetry/instrumentation-runtime-node";
import { TediousInstrumentation } from "@opentelemetry/instrumentation-tedious";
import { jsonConsole, jsonLogs } from "./log";
import { RequestSpanProcessor, UntracedPathsSampler } from "./requests";
import { startHealthGauge } from "./health";

if (jsonLogs) jsonConsole();

if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
  const sdk = new NodeSDK({
    serviceName: process.env.OTEL_SERVICE_NAME ?? "dechets",
    sampler: new ParentBasedSampler({ root: new UntracedPathsSampler() }),
    spanProcessors: [new RequestSpanProcessor(new BatchSpanProcessor({ exporter: new OTLPTraceExporter() }))],
    // Metrics: the OTLP/HTTP exporter and the interval NodeSDK reads from the environment.
    instrumentations: [
      // Every SQL query a span (Prisma → mssql → tedious): the statement, the server, the database.
      new TediousInstrumentation(),
      // nodejs_eventloop_*, v8js_memory_*: the Runtime row.
      new RuntimeNodeInstrumentation(),
    ],
  });
  sdk.start();
  // Prisma loads its adapter with an ESM import(), and mssql and tedious through it: the require
  // hook of the instrumentation never sees tedious, and no query gets a span. Required here, from
  // the app's node_modules, tedious is patched (its Connection's prototype) before Prisma comes.
  // Through getBuiltinModule: webpack rewrites an import of node:module, and createRequire is lost.
  const { createRequire } = process.getBuiltinModule("node:module");
  createRequire(`${process.cwd()}/package.json`)("tedious");
  startHealthGauge();
  process.once("SIGTERM", () => {
    sdk.shutdown().catch(() => undefined);
  });
}
