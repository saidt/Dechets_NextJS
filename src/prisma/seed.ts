import { consoleError } from '@/lib/clientLog';
import { hashPassword } from '@/lib/crypt'
import { prisma } from "@/lib/prisma";

async function main() {
  const password = 'hashed_password'
  const hash = await hashPassword(password)   // needs NEXTAUTH_SECRET

  await prisma.user.upsert({
    where: { email: 'example@example.com' },
    update: {},
    create: {
      id: 'Example',
      name: 'Example',
      email: 'example@example.com',
      psw_hash: hash
    }
  })
  //consoleInfo('Seeded user: example@example.com / hashed_password')
}

main()
  .catch(e => { consoleError(e); process.exit(1) })
  .finally(() => prisma.$disconnect())