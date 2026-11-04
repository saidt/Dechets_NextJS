import { getServerSession, Session } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from './prisma';
import { exists_User_Role } from '@/app/db-data/user-role';

/** Why a session was rejected; also used as the ?error= code of the login page. */
export type SessionError = 'SessionNotFound' | 'SessionUiidNotFound' | 'DbSessionNotFound' | 'SessionExpired';

export type SessionCheck =
  | { session: Session; error: null }
  | { session: null; error: SessionError };

/**
 * Checks the NextAuth session (JWT cookie) and its row in the Session table:
 * the row must exist, belong to the same user and not be expired. Deleting a
 * Session row therefore logs that user out on their next request.
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
  if (new Date(dbSession.expires) < new Date()) {
    return { session: null, error: 'SessionExpired' };
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
