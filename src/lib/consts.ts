export const DEFAULT_PAGE_SIZE = 10
export const ALTERT_TIME = 6000 // ms
export const ADMIN_ROLE = 'ADMIN'
export const ROLES_CACHE_KEY = "AUTH_USER_CACHE";
export const MAX_ALL_DATA_SIZE = 1000000;
// Browser settings from .env. NEXT_PUBLIC_ variables are written into the browser code
// when the app is built: change them, then rebuild. Each one is read by its literal name
// (process.env.NEXT_PUBLIC_...), which Next.js needs to replace it.
// A missing or invalid value (not a positive integer) uses the default.
const positiveInt = (raw: string | undefined, defaultValue: number): number => {
  const value = Number(raw);
  return raw !== undefined && raw.trim() !== "" && Number.isInteger(value) && value > 0 ? value : defaultValue;
};

/** ms: delay after typing in a column filter before the list reloads. .env: NEXT_PUBLIC_FILTER_DEBOUNCE_MS (default 500) */
export const FILTER_DEBOUCE_TIME = positiveInt(process.env.NEXT_PUBLIC_FILTER_DEBOUNCE_MS, 500);
/** ms: how often an open page asks the server whether its session is still valid. .env: NEXT_PUBLIC_SESSION_CHECK_INTERVAL_SECONDS (default 60) */
export const SESSION_CHECK_INTERVAL = positiveInt(process.env.NEXT_PUBLIC_SESSION_CHECK_INTERVAL_SECONDS, 60) * 1000;
// Session length and login lockout (server only): see src/lib/authSettings.ts
