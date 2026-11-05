import { getServerSession, Session } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from './prisma';
import { exists_User_Role } from '@/app/db-data/user-role';
import { getClientInfo } from './client-info';
import { createLog } from '@/app/db-data/log';

/** Why a session was rejected; also used as the ?error= code of the login page. */
export type SessionError = 'SessionNotFound' | 'SessionUiidNotFound' | 'DbSessionNotFound' | 'SessionExpired' | 'SessionClientChanged';

export type SessionCheck =
  | { session: Session; error: null }
  | { session: null; error: SessionError };

/**
 * Checks the NextAuth session (JWT cookie) and its row in the Session table:
 * the row must exist, belong to the same user and not be expired. Deleting a
 * Session row therefore logs that user out on their next request.
 *
 * Fixed expiry: the row expires SESSION_MAX_AGE after login, whatever the
 * activity, so a stolen session cookie stops working at that time at the latest.
 *
 * Browser and network binding: the request's User-Agent and IP address must be
 * the ones stored at login. Otherwise the session row is deleted (the cookie is
 * dead everywhere, including for the real user) and the event is logged.
 * Used by proxy.ts and by API routes (so they don't rely on proxy.ts having run).
 */
export async function checkSession(): Promise<SessionCheck> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!session || !userId) {
    return { session: null, error: 'SessionNotFound' };
  }

  const sessionUuid = session.sessionUuid;
  if (!sessionUuid) {
    return { session: null, error: 'SessionUiidNotFound' };
  }

  const dbSession = await prisma.session.findUnique({
    where: { sessionToken: sessionUuid },
  });
  if (!dbSession || dbSession.userId.trim() !== userId.trim()) {
    return { session: null, error: 'DbSessionNotFound' };
  }
  if (new Date(dbSession.expires).getTime() < Date.now()) {
    return { session: null, error: 'SessionExpired' };
  }

  const client = await getClientInfo();
  const browserChanged = (dbSession.userAgent ?? '') !== client.userAgent;
  const ipChanged = (dbSession.ipAddress ?? '') !== client.ip;
  if (browserChanged || ipChanged) {
    await prisma.session.deleteMany({ where: { sessionToken: sessionUuid } });
    // Best effort: a logging failure must not prevent the revocation
    await createLog({
      id: 0,
      date_oper: new Date(),
      user_id: userId,
      severite: 'warn',
      message: `Session revoked: ${[browserChanged && 'browser', ipChanged && 'IP address'].filter(Boolean).join(' and ')} changed`,
      contexte: JSON.stringify({
        ip: { login: dbSession.ipAddress, now: client.ip },
        userAgent: { login: dbSession.userAgent, now: client.userAgent },
      }),
    }).catch(() => undefined);
    return { session: null, error: 'SessionClientChanged' };
  }

  return { session, error: null };
}

/** The current session if it is valid in the database, otherwise null. */
export async function getValidSession(): Promise<Session | null> {
  return (await checkSession()).session;
}

export async function checkLoggedIn(): Promise<boolean> {
  return (await getValidSession()) !== null;
}

export async function checkRole(roleId: string): Promise<boolean> {
  const session = await getValidSession();
  const userId = session?.user?.id;
  const role = roleId.trim().toUpperCase();

  if (userId && (await exists_User_Role(userId, role))) {
    return true;
  }

  return false;
}
