import { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { v4 as uuid } from "uuid"
import CredentialsProvider  from 'next-auth/providers/credentials';
import { credentials_Schema } from '@/types/credentials';
import { prisma } from './prisma';
import { updateUserLastConnected } from '@/app/db-data/user';
import { LogType } from '@/types/log';
import { createLog } from '@/app/db-data/log';
import { dbLogin, INVALID_CREDENTIALS, loginLockedUntil, LOGIN_BLOCKED_MESSAGE, LOGIN_FAILED_MESSAGE, LOGIN_SUCCESS_MESSAGE } from '@/app/db-data/auth';
import { ZodError } from 'zod';
import { logError } from './serverLog';
import { LOGIN_MAX_FAILURES, SESSION_MAX_AGE } from './consts';
import { getClientInfo } from './client-info';
import { consoleDebug, consoleError, consoleWarn } from './clientLog';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE, // 1 day in seconds
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userId: { label: "User Id" },
        password: { label: "Password", type: "password" },
      },
      // Checks the password directly (no HTTP call to a public login route)
      async authorize(credentials) {
        // User id as stored in LOG (USER_ID is 20 characters)
        const userId = typeof credentials?.userId === 'string' ? credentials.userId.trim().slice(0, 20) : '';

        // Lockout after LOGIN_MAX_FAILURES failed logins: refuse without checking the password
        let lockedUntil: Date | null = null;
        try {
          lockedUntil = userId ? await loginLockedUntil(userId) : null;
        }
        catch (err) {
          logError('authorize lockout check', err);
          throw new Error("Login unavailable, please try again later !");
        }
        if (lockedUntil) {
          await createLog({
            id: 0,
            date_oper: new Date(),
            user_id: userId,
            severite: 'warn',
            message: LOGIN_BLOCKED_MESSAGE,
            contexte: JSON.stringify({ lockedUntil }),
          }).catch(() => undefined);
          const minutes = Math.max(1, Math.ceil((lockedUntil.getTime() - Date.now()) / 60000));
          throw new Error(`Too many failed logins (${LOGIN_MAX_FAILURES}): try again in ${minutes} minute(s) !`);
        }

        try {
          const parsedCredentials = credentials_Schema.parse(credentials);
          return await dbLogin(parsedCredentials);
        }
        catch (err) {
          const rejected = err instanceof ZodError || (err instanceof Error && err.message === INVALID_CREDENTIALS);
          if (!rejected) {
            // Database or other technical error: not a failed login
            logError('authorize', err);
            throw new Error("Login unavailable, please try again later !");
          }
          // Failed attempts are logged (user id only, never the password), to spot password guessing
          await createLog({
            id: 0,
            date_oper: new Date(),
            user_id: userId || undefined,
            severite: 'warn',
            message: LOGIN_FAILED_MESSAGE,
            contexte: '',
          }).catch(() => undefined);
          // Same message whatever the reason (unknown user, wrong password, invalid input)
          throw new Error(INVALID_CREDENTIALS);
        }
      }
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/error",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      //consoleInfo('callbacks url : ', url);
      //consoleInfo('callbacks baseUrl : ', baseUrl);
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      //if (url.startsWith("/")) return url;

      // Respect same-origin absolute URLs
      try {
        const u = new URL(url);
        if (u.origin === baseUrl) return url;

        // If a callbackUrl param exists within an absolute signin URL
        const cb = u.searchParams.get("callbackUrl");
        //consoleInfo('callbacks callbackUrl : ', cb);
        if (cb) {
          const cbUrl = new URL(cb, baseUrl);
          if (cbUrl.origin === baseUrl) return cbUrl.toString();
        }
      } 
      catch {
        // If url is not a valid absolute URL, ignore and fall back
      }
      
      // DEFAULT: when no callbackUrl or it's external → send to "/"
      return baseUrl;
    },

    async session({ session, token }) {
      try {
        if (token.sub) {
          session.user.id = token.sub;
          session.sessionUuid = token.sessionUuid as string;
          // Show the expiry from the Session row; fall back to the login-time value
          const dbSession = token.sessionUuid
            ? await prisma.session.findUnique({ where: { sessionToken: token.sessionUuid as string } })
            : null;
          session.expiresAt = dbSession?.expires ?? token.expiresAt
          session.user.lastConnect = token.lastConnect
        }
        return session;
      }
      catch (err) {
        throw err;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.credentials = true

        // Housekeeping: drop expired sessions (logins are rare, so this is cheap)
        await prisma.session.deleteMany({
          where: { expires: { lt: new Date() } },
        });

        const sessionUuid = uuid()
        const expiresAt = new Date(Date.now() + 1 * SESSION_MAX_AGE * 1000) // 1 day in milliseconds

        // Bind the session to the browser and IP address it is created from
        const { userAgent, ip } = await getClientInfo()

        const createdSession = await prisma.session.create({
          data: { 
            sessionToken : sessionUuid,
            userId: user.id,
            expires: expiresAt,
            userAgent,
            ipAddress: ip,
          }
        })

        const dbUser = await prisma.user.findUnique({
          where: { 
            id: user.id
          }
        })

        if (dbUser?.last_connect) {
          token.lastConnect = dbUser.last_connect
        }

        if (!createdSession) {
          throw new Error("Failed to create session")
        }

        token.sessionUuid = sessionUuid;
        token.userId = user.id;
        token.expiresAt = expiresAt;

        //consoleInfo('jwt token: ', token)
      }

      return token
    },
  },  
  events: {
    async signIn({ user }) {
      //consoleInfo("User signed in:", user.id);
      await updateUserLastConnected(user.id);

      const log : LogType = {
        id: 0,
        date_oper: new Date(),
        user_id: user.id,
        severite: 'info',
        message: LOGIN_SUCCESS_MESSAGE,
        contexte: ''
      }
      await createLog(log)
    },
    async signOut({ token }) {
      //consoleInfo("User signed out:", token.userId);
      await prisma.session.deleteMany({
        where: { sessionToken: token.sessionUuid },
      });
    },
    async session(message) {
      //consoleInfo("Session active for user:", message.session.user.id);
    },
  },
  logger: {
    error(code, metadata) {
      consoleError(code, metadata)
    },
    warn(code) {
      consoleWarn(code)
    },
    debug(code, metadata) {
      consoleDebug(code, metadata)
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};