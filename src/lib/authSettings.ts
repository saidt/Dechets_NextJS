import { logWarn } from "./serverLog";

/**
 * Login and session settings, read from the environment (.env) on the server.
 * A missing or invalid value falls back to the default (and is reported in the server log).
 *
 *   SESSION_MAX_AGE_HOURS   session length after login, fixed (default 24 = 1 day)
 *   LOGIN_MAX_FAILURES      failed logins that lock a user id (default 5)
 *   LOGIN_LOCK_MINUTES      lock duration, and window in which failures count (default 15)
 *
 * Server only: these variables are not sent to the browser.
 */
function positiveIntFromEnv(name: string, defaultValue: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return defaultValue;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    logWarn("authSettings", `${name}="${raw}" is not a positive integer: using ${defaultValue}`);
    return defaultValue;
  }
  return value;
}

/** Session length in seconds: a session expires this long after login, whatever the activity. */
export const SESSION_MAX_AGE = positiveIntFromEnv("SESSION_MAX_AGE_HOURS", 24) * 60 * 60;
/** Failed logins (within LOGIN_LOCK_MINUTES) that lock a user id. */
export const LOGIN_MAX_FAILURES = positiveIntFromEnv("LOGIN_MAX_FAILURES", 5);
/** Lock duration in minutes, counted from the oldest of those failures. */
export const LOGIN_LOCK_MINUTES = positiveIntFromEnv("LOGIN_LOCK_MINUTES", 15);
