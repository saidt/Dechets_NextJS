import { prisma } from "@/lib/prisma";
import { Stored_Proc_Param_Meta_Type, Stored_Proc_Param_Type } from "@/types/sp";
import { Prisma } from "@prisma/client";
import { consoleInfo } from "./clientLog";

function validatName(name: string): void {
  const valid = /^[a-zA-Z0-9_.]+$/.test(name);

  if (!valid) {
    throw new Error("Invalid name");
  }
}

export async function execStoredProc(
  spName: string,
  params: Stored_Proc_Param_Type[] = [],
) {
  validatName(spName);

  for (const param of params) {
    validatName(param.name);
  }

  if (params.length === 0) {
    return prisma.$queryRaw(
      Prisma.raw(`EXEC ${spName}`),
    );
  }

  const sqlParts: Prisma.Sql[] = [];

  sqlParts.push(Prisma.sql`EXEC `);
  sqlParts.push(Prisma.raw(spName));
  sqlParts.push(Prisma.sql` `);

  params.forEach((param, index) => {
    sqlParts.push(
      Prisma.sql`${Prisma.raw(`@${param.name}`)} = ${param.value}`,
    );

    if (index < params.length - 1) {
      sqlParts.push(Prisma.sql`, `);
    }
  });

  return prisma.$queryRaw(Prisma.join(sqlParts, ""));
}

export async function storedProcParams(spName: string) {
  // result param name is empty
  const result = await prisma.$queryRaw<Stored_Proc_Param_Meta_Type[]>`
    SELECT
      p.name AS name,
      t.name AS data_type,
      p.parameter_id as id
    FROM sys.parameters p
    JOIN sys.types t ON p.user_type_id = t.user_type_id
    WHERE object_id = OBJECT_ID(${spName})
    and p.name <> ''
    ORDER BY p.parameter_id
  `;

  if (!result) {
    return { error: "storedProcParams error" };
  }

  return result;
}

export async function execScalarFunction(
  fnName: string,
  params: Stored_Proc_Param_Type[] = [],
) {
  validatName(fnName);

  for (const param of params) {
    validatName(param.name);
  }

  const sqlParts: Prisma.Sql[] = [];

  sqlParts.push(Prisma.sql`SELECT `);
  sqlParts.push(Prisma.raw(fnName));
  sqlParts.push(Prisma.sql`(`);

  params.forEach((param, index) => {
    sqlParts.push(Prisma.sql`${param.value}`);

    if (index < params.length - 1) {
      sqlParts.push(Prisma.sql`, `);
    }
  });

  sqlParts.push(Prisma.sql`) AS RET_VALUE`);

  consoleInfo('execScalarFunction : ', Prisma.join(sqlParts, ""));

  return prisma.$queryRaw(Prisma.join(sqlParts, ""));
}

export async function scalarFunctionParams(sfName: string) {
  return storedProcParams(sfName);
}