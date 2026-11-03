import { isDevMode } from "./lib";

export function consoleDebug(...messages: Parameters<typeof console.info>) {
  isDevMode() && console.debug(...messages);
}

export function consoleInfo(...messages: Parameters<typeof console.info>) {
  isDevMode() && console.info(...messages);
}

export function consoleWarn(...messages: Parameters<typeof console.info>) {
  isDevMode() && console.warn(...messages);
}

export function consoleError(...messages: Parameters<typeof console.info>) {
  isDevMode() && console.error(...messages);
}