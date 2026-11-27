import { PrismaMssql } from "@prisma/adapter-mssql"
import { Prisma, PrismaClient } from "@prisma/client";

const adapter = new PrismaMssql(process.env.DATABASE_URL!);

/**
 * SQL decimal columns come back as Prisma.Decimal objects, which become strings in JSON
 * ("12.50"), so the browser could not tell an amount from a text code made of digits.
 * They are turned into numbers here, for every query: the browser then formats a value
 * by its real type (formatValue: typeof value === "number"). The largest columns,
 * decimal(15,3), fit exactly in a JavaScript number.
 */
function decimalsToNumbers(value: unknown): unknown {
  if (Prisma.Decimal.isDecimal(value)) {
    return (value as Prisma.Decimal).toNumber();
  }
  if (Array.isArray(value)) {
    return value.map(decimalsToNumbers);
  }
  if (value !== null && typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    // Only plain objects (rows, nested relations): Date, Buffer and the like are kept as they are
    if (proto === Object.prototype || proto === null) {
      return Object.fromEntries(
        Object.entries(value).map(([key, v]) => [key, decimalsToNumbers(v)])
      );
    }
  }
  return value;
}

export const prisma = new PrismaClient({
  adapter
}).$extends({
  query: {
    // All model operations and raw queries ($queryRaw: statistics, stored procedures)
    async $allOperations({ args, query }) {
      return decimalsToNumbers(await query(args));
    },
  },
});
