import { trimStrings } from "@/lib/lib";
import { prisma } from "@/lib/prisma";
//import { consoleInfo } from "@/lib/clientLog";

// Never return the password hash outside the login code (db-data/auth.ts)
const OMIT_PASSWORD = { psw_hash: true } as const;

export async function read_User(id: string): Promise<any> {
  const user = await prisma.user.findUnique({
    where: { id },
    omit: OMIT_PASSWORD,
  })

  //consoleInfo("fetch_User user: ", user)

  return trimStrings(user);
}

export async function userByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email },
    omit: OMIT_PASSWORD,
  });

  return trimStrings(user);
}

export async function updateUserLastConnected(id: string) {
  return await prisma.user.update({
    where: { id: id },
    data: {
      last_connect: new Date(),
    },
    omit: OMIT_PASSWORD,
  });
}
/** The stored password hash, for the user's own password change only (never sent to the browser). */
export async function read_User_Password_Hash(id: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { psw_hash: true },
  });
  return user?.psw_hash ?? null;
}

/** Saves a new password hash (bcrypt, from hashPassword). */
export async function update_User_Password_Hash(id: string, pswHash: string): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: { psw_hash: pswHash },
    select: { id: true },
  });
}
