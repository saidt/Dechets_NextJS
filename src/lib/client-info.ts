import { headers } from 'next/headers';

export type ClientInfo = {
  userAgent: string;
  ip: string;
};

const USER_AGENT_MAX_LENGTH = 500; // Session.USER_AGENT column size

/**
 * Browser (User-Agent) and IP address of the current request, used to bind a
 * session to the browser and network it was created from. Server only.
 *
 * IP address: Next.js puts the socket address in X-Forwarded-For only when the
 * header is absent, and each reverse proxy appends the address it received the
 * request from. TRUSTED_PROXY_COUNT (env, default 0) is the number of reverse
 * proxies in front of Next.js (IIS, nginx...): the client IP is the entry that
 * the outermost trusted proxy appended. With no proxy (0), a client could send
 * its own X-Forwarded-For value, so the IP check can only be trusted when a
 * reverse proxy in front of Next.js sets or appends that header.
 */
export async function getClientInfo(): Promise<ClientInfo> {
  const h = await headers();

  const userAgent = (h.get('user-agent') ?? '').slice(0, USER_AGENT_MAX_LENGTH);

  const forwarded = (h.get('x-forwarded-for') ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  const trustedProxies = Math.max(1, Number(process.env.TRUSTED_PROXY_COUNT ?? 0) || 0);
  const raw = forwarded.length > 0 ? forwarded[Math.max(0, forwarded.length - trustedProxies)] : '';

  return { userAgent, ip: normalizeIp(raw) };
}

/** "::ffff:192.168.1.5" (IPv4 seen through an IPv6 socket) -> "192.168.1.5" */
function normalizeIp(ip: string): string {
  return ip.startsWith('::ffff:') && ip.includes('.') ? ip.slice('::ffff:'.length) : ip;
}
