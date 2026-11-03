import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Pesee_Type } from "@/types/pesee";

export async function pesee_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.pesee.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function pesee_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.pesee.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsPesee(id: number) : Promise<boolean> {
  const pesees = await prisma.pesee.findMany({
    where: { id: id }
  });

  return pesees.length > 0;
}*/

export async function read_Pesee(numero_1: string, ) : Promise<Pesee_Type> {
  const fetched = await prisma.pesee.findUnique({
    where: { 
        numero_1: numero_1,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}