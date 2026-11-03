import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Periode_Type } from "@/types/periode";

export async function periode_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.periode.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function periode_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.periode.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsPeriode(id: number) : Promise<boolean> {
  const periodes = await prisma.periode.findMany({
    where: { id: id }
  });

  return periodes.length > 0;
}*/

export async function read_Periode(code: string, ) : Promise<Periode_Type> {
  const fetched = await prisma.periode.findUnique({
    where: { 
        code: code,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Periode(periode: Periode_Type) : Promise<Periode_Type> {
  const inserted = await prisma.periode.create({
    data: periode
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Periode(periode: any) : Promise<Periode_Type> {
  const { code, ...periode_Data } : any = periode;
  
  const updated = await prisma.periode.update({
    where: {
        code: periode.code,
      },
    data: periode_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Periode(code: string, ) : Promise<Periode_Type> {
  const deleted = await prisma.periode.delete({
    where: { 
        code: code,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}