const LOGIN_PATH = "/auth/login";

/**
 * fetch() wrapper for calls to /api/protected/*.
 *
 * When the session is missing or expired, proxy.ts redirects API calls to
 * /auth/login?error=... . fetch() follows that redirect silently and returns the
 * login page HTML with status 200, so the caller never sees an error.
 * Detect that case and move the whole browser window to the login page instead.
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);

  if (
    typeof window !== "undefined" &&
    response.redirected &&
    new URL(response.url).pathname === LOGIN_PATH
  ) {
    window.location.href = response.url;   // e.g. /auth/login?error=SessionNotFound
    return new Promise<Response>(() => {}); // never resolves: stop the caller while the page changes
  }

  return response;
}
