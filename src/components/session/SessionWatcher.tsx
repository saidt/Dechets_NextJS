"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/apiFetch";
import { SESSION_CHECK_INTERVAL } from "@/lib/consts";

const LOGIN_PATH = "/auth/login";
const CHECK_URL = "/api/protected/session-check";

/** Sends the whole page to the login page, then back to this page after login. */
function goToLogin(reason: string) {
  const back = window.location.pathname + window.location.search;
  window.location.assign(`${LOGIN_PATH}?error=${encodeURIComponent(reason)}&callbackUrl=${encodeURIComponent(back)}`);
}

/**
 * Takes an idle page to the login page when its session ends, instead of waiting for
 * the next click:
 * - at the session's end time (expiresAt, from the Session row);
 * - when the server says the session has ended early (terminated in "Sessions",
 *   "Terminer les autres sessions", browser or IP changed): checked every
 *   SESSION_CHECK_INTERVAL and as soon as the tab becomes visible again.
 * A network error doesn't log the user out: the next check tries again.
 * Renders nothing; mounted once in app.tsx.
 */
export default function SessionWatcher() {
  const { data: session, status } = useSession();
  const expiresAt = session?.expiresAt ? new Date(session.expiresAt).getTime() : null;

  // 1. At the end time
  useEffect(() => {
    if (status !== "authenticated" || expiresAt === null) return;
    const delay = expiresAt - Date.now();
    if (delay <= 0) {
      goToLogin("SessionExpired");
      return;
    }
    // setTimeout holds at most ~24.8 days; sessions last 1 day
    const timer = setTimeout(() => goToLogin("SessionExpired"), Math.min(delay + 1000, 2 ** 31 - 1));
    return () => clearTimeout(timer);
  }, [status, expiresAt]);

  // 2. Ended early on the server
  useEffect(() => {
    if (status !== "authenticated") return;
    let stopped = false;

    const check = async () => {
      if (stopped || document.visibilityState !== "visible") return;
      try {
        // apiFetch moves the page to the login page when proxy.ts redirects the call
        const response = await apiFetch(CHECK_URL, { cache: "no-store" });
        if (stopped) return;
        if (response.status === 401) {
          const json = await response.json().catch(() => ({}));
          goToLogin(json.error || "SessionNotFound");
        }
      }
      catch {
        // network error or server restarting: try again at the next check
      }
    };

    const interval = setInterval(check, SESSION_CHECK_INTERVAL);
    const onVisible = () => { if (document.visibilityState === "visible") check(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [status]);

  return null;
}
