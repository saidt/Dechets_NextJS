import { consoleError } from '@/lib/clientLog';
import { createSaltedSHA256Hash } from '@/lib/crypt'
import { prisma } from "@/lib/prisma";

async function main() {
  const password = 'hashed_password'
  const hash = createSaltedSHA256Hash('Example', password)   // needs NEXTAUTH_SECRET

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