import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    sessionUuid: string;
    expiresAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
      lastConnect?: Date;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sessionUuid: string;
    userId: string;
    expiresAt: Date;
    lastConnect?: Date;
  }
}