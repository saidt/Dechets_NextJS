import { PrismaMssql } from "@prisma/adapter-mssql"
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMssql(process.env.DATABASE_URL!);

export const prisma = new PrismaClient({
  adapter
})
