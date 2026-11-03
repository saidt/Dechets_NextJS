import { logger } from "@/components/logger/loggingService";
import { LogLevel } from "@/types/log";
import { consoleDebug, consoleError, consoleInfo, consoleWarn } from "./clientLog";

export function logLevel(level: LogLevel, message: string, error: any) {

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

export function logInfo(message: string, error: any) {
  logLevel("info", message, error)
}

export function logDebug(message: string, error: any) {
  logLevel("debug", message, error)
}

export function logWarn(message: string, error: any) {
  logLevel("warn", message, error)
}

export function logError(message: string, error: any) {
  logLevel("error", message, error)
}