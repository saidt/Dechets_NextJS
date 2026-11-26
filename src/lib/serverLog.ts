import { logger } from "@/components/logger/loggingService";
import { LogLevel } from "@/types/log";
import { consoleDebug, consoleError, consoleInfo, consoleWarn } from "./clientLog";
import { jsonLogs, writeJson } from "./telemetry/log";

export function logLevel(level: LogLevel, message: string, error: unknown) {

  // In the cluster (LOG_FORMAT=json): one pino JSON line on stdout, the error in `err` (its type
  // groups it in Grafana's « Erreurs » tab), nothing in the pod's files.
  if (jsonLogs) {
    writeJson(level, message, error);
    return;
  }

  const msg = `${message}: ${String(error)}`
  
  switch (level) {
    case "debug":
      consoleDebug(msg)
      logger.debug(msg)
      break;
    case "warn":
      consoleWarn(msg)
      logger.warn(msg)
      break;
    case "error":
      consoleError(msg)
      logger.error(msg)
      break;
    default:
      consoleInfo(msg)
      logger.info(msg)
  }  
}

export function logInfo(message: string, error: unknown) {
  logLevel("info", message, error)
}

export function logDebug(message: string, error: unknown) {
  logLevel("debug", message, error)
}

export function logWarn(message: string, error: unknown) {
  logLevel("warn", message, error)
}

export function logError(message: string, error: unknown) {
  logLevel("error", message, error)
}
