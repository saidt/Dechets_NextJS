import { verifyPassword } from "@/lib/crypt";
import { Credentials, credentials_Schema } from "@/types/credentials";
import { prisma } from "@/lib/prisma";
import { trimStrings } from "@/lib/lib";

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

  if (user && await verifyPassword(validateCredentials.password, user.psw_hash)) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      last_connect: user.last_connect,
    };
  } 
  else {
    // Same message whether the user is unknown or the password is wrong
    throw new Error("Invalid credentials !");
  }
}
