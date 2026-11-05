import { prisma } from "@/lib/prisma";
import { SESSION_MAX_AGE } from "@/lib/consts";
import { User_Session_Type } from "@/types/user-session";

/** Active (not expired) sessions of a user, newest first. Never returns the session token. */
export async function list_User_Sessions(userId: string, currentSessionToken: string): Promise<User_Session_Type[]> {
  const rows = await prisma.session.findMany({
    where: { userId, expires: { gt: new Date() } },
    orderBy: { expires: "desc" },
    select: { id: true, sessionToken: true, expires: true, userAgent: true, ipAddress: true },
  });

  return rows.map((row) => ({
    id: row.id,
    // Sessions have a fixed lifetime, so the login time is expires - SESSION_MAX_AGE
    started: new Date(row.expires.getTime() - SESSION_MAX_AGE * 1000).toISOString(),
    expires: row.expires.toISOString(),
    userAgent: row.userAgent,
    ipAddress: row.ipAddress,
    current: row.sessionToken === currentSessionToken,
  }));
}

/** Deletes one session of a user. Returns false if the user has no such session. */
export async function delete_User_Session(userId: string, sessionId: string): Promise<boolean> {
  const result = await prisma.session.deleteMany({
    where: { id: sessionId, userId },
  });
  return result.count > 0;
}
