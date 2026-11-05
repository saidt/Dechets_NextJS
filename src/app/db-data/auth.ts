import { isBcryptHash, verifyPassword } from "@/lib/crypt";
import { Credentials, credentials_Schema } from "@/types/credentials";
import { prisma } from "@/lib/prisma";
import { trimStrings } from "@/lib/lib";
import { LOGIN_LOCK_MINUTES, LOGIN_MAX_FAILURES } from "@/lib/consts";

export const INVALID_CREDENTIALS = "Invalid credentials !";

/**
 * Login refused. The message is always INVALID_CREDENTIALS (shown to the user, so it
 * reveals nothing); reason says why, for the server log only.
 */
export class LoginRejectedError extends Error {
  constructor(public readonly reason: string) {
    super(INVALID_CREDENTIALS);
    this.name = "LoginRejectedError";
  }
}

// LOG.MESSAGE values written by the login process (also used to count failures)
export const LOGIN_SUCCESS_MESSAGE = "User logged in";
export const LOGIN_FAILED_MESSAGE = "Login failed";
export const LOGIN_BLOCKED_MESSAGE = "Login blocked: user id locked";

/**
 * Lockout: a user id is locked once it has LOGIN_MAX_FAILURES failed logins in
 * the last LOGIN_LOCK_MINUTES, counting only failures after its last successful
 * login. Returns the time the lock ends, or null if the user id is not locked.
 * Attempts refused because of the lock are not counted, so an attacker cannot
 * keep a user locked forever; it works the same for unknown user ids, so it does
 * not reveal which ids exist.
 */
export async function loginLockedUntil(userId: string): Promise<Date | null> {
  const windowStart = new Date(Date.now() - LOGIN_LOCK_MINUTES * 60 * 1000);

  const lastSuccess = await prisma.log.findFirst({
    where: { user_id: userId, message: LOGIN_SUCCESS_MESSAGE },
    orderBy: { date_oper: "desc" },
    select: { date_oper: true },
  });
  const countFrom = lastSuccess && lastSuccess.date_oper > windowStart ? lastSuccess.date_oper : windowStart;

  const failures = await prisma.log.findMany({
    where: { user_id: userId, message: LOGIN_FAILED_MESSAGE, date_oper: { gt: countFrom } },
    orderBy: { date_oper: "desc" },
    take: LOGIN_MAX_FAILURES,
    select: { date_oper: true },
  });
  if (failures.length < LOGIN_MAX_FAILURES) {
    return null;
  }

  // Locked until the oldest of the last LOGIN_MAX_FAILURES failures leaves the window
  const oldest = failures[failures.length - 1].date_oper;
  return new Date(oldest.getTime() + LOGIN_LOCK_MINUTES * 60 * 1000);
}

export async function dbLogin(credentials: Credentials) {
  const validateCredentials : Credentials = credentials_Schema.parse(credentials);

  // A bcrypt hash can't be searched for: read the user by id, then check the
  // password against its stored hash.
  const data = await prisma.user.findUnique({
    where: {
      id: `${validateCredentials.userId}`,
    },
  });

  const user = trimStrings(data)

  // Same message for the user whatever the reason; the reason is for the server log
  if (!user) {
    throw new LoginRejectedError("user not found");
  }
  if (!isBcryptHash(user.psw_hash)) {
    throw new LoginRejectedError("stored password hash is empty or not a bcrypt hash");
  }
  if (!await verifyPassword(validateCredentials.password, user.psw_hash)) {
    throw new LoginRejectedError("wrong password (or NEXTAUTH_SECRET differs from when the hash was made)");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    last_connect: user.last_connect,
  };
}
