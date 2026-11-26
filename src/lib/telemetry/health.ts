/**
 * dechets_health_check_status{check}: 1 when the check passes, 0 when it fails. The app is in
 * « Toutes les apps » through it, DOWN as soon as a check is 0. Computed on each metric export,
 * without a trace (suppressTracing), not on the probe: /health/live answers 200 even when the
 * database is down, so that the pod is not restarted in a loop.
 */
import { context, metrics } from "@opentelemetry/api";
import { suppressTracing } from "@opentelemetry/core";
import { prisma } from "@/lib/prisma";

const TIMEOUT_MS = 5000;

const checks: Record<string, () => Promise<unknown>> = {
  database: () => prisma.$queryRaw`SELECT 1`,
};

async function passes(check: () => Promise<unknown>): Promise<boolean> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS);
  });
  try {
    await Promise.race([check(), timeout]);
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export function startHealthGauge(): void {
  metrics
    .getMeter("dechets")
    .createObservableGauge("dechets_health_check_status", {
      description: "1 when the check passes, 0 when it fails",
    })
    .addCallback(async (result) => {
      await context.with(suppressTracing(context.active()), async () => {
        for (const [name, check] of Object.entries(checks)) {
          result.observe((await passes(check)) ? 1 : 0, { check: name });
        }
      });
    });
}
