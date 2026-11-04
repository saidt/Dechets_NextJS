import { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { v4 as uuid } from "uuid"
import CredentialsProvider  from 'next-auth/providers/credentials';
import { getResponseData } from './html';
import { credentials_Schema } from '@/types/credentials';
import { prisma } from './prisma';
import { updateUserLastConnected } from '@/app/db-data/user';
import { LogType } from '@/types/log';
import { createLog } from '@/app/db-data/log';
import { SESSION_MAX_AGE } from './consts';
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
      async authorize(credentials) {
        const parsedCredentials = credentials_Schema.parse(credentials);

        if (!parsedCredentials) {
          throw new Error("Invalid credentials format.");
        }

        const response  = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: credentials?.userId,
            password: credentials?.password,
          }),
        });

        const data = await getResponseData(response, 'login api response')
        //consoleInfo('authorize data : ', JSON.stringify(data));

        if (data.user) {
          return data.user;
        }
        return null;
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
          // Show the real (sliding) expiry from the Session row; fall back to the login-time value
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

        const createdSession = await prisma.session.create({
          data: { 
            sessionToken : sessionUuid,
            userId: user.id,
            expires: expiresAt,
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
        message: `User logged in`,
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