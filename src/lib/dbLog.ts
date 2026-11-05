import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { createLog } from '@/app/db-data/log';
import { logError } from './serverLog';
import { LogLevel } from '@/types/log';

/**
 * Audit entry in the LOG table, written directly by server code (API routes).
 * The user id comes from the session, never from the caller. Never throws: a
 * logging failure is written to the server log and must not break the request.
 */
export async function dbLog(level: LogLevel, message: string, context?: Record<string, unknown>): Promise<void> {
  try {
    const session = await getServerSession(authOptions);
    await createLog({
      id: 0,
      date_oper: new Date(),
      user_id: session?.user?.id,
      severite: level,
      message,
      contexte: JSON.stringify(context ?? {}),
    });
  }
  catch (err) {
    logError(`dbLog: ${message}`, err);
  }
}
