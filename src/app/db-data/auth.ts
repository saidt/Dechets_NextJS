import { createSHA256Hash } from "@/lib/crypt";
import { Credentials, credentials_Schema } from "@/types/credentials";
import { prisma } from "@/lib/prisma";
import { trimStrings } from "@/lib/lib";

export async function dbLogin(credentials: Credentials) {
  const validateCredentials : Credentials = credentials_Schema.parse(credentials);
  const hashPswd = createSHA256Hash(credentials.password);

  const data = await prisma.user.findUnique({
    where: {
      id: `${validateCredentials.userId}`,
      psw_hash: `${hashPswd}`,
    },
  });

  const user=trimStrings(data)

  if (user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      last_connect: user.last_connect,
    };
  } 
  else {
    throw new Error("Invalid credentials !");
  }
}

export async function session(sessionToken: string) {
  const data = await prisma.session.findUnique({
    where: { sessionToken }
  })

  return data;
}