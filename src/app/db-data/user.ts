import { consoleInfo } from "@/lib/clientLog";
import { trimStrings } from "@/lib/lib";
import { prisma } from "@/lib/prisma";

export async function read_User(id: string): Promise<any> {
  const user = await prisma.user.findUnique({
    where: { id }
  })

  consoleInfo("fetch_User user: ", user)

  return trimStrings(user);
}

export async function userByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  return trimStrings(user);
}

export async function updateUserLastConnected(id: string) {
  return await prisma.user.update({
    where: { id: id },
    data: {
      last_connect: new Date(),
    },
  });
}