'use server'

import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Unite_Conversion_Type } from "@/types/unite-conversion";

export async function unite_Conversion_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.unite_Conversion.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function unite_Conversion_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.unite_Conversion.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsUnite_Conversion(id: number) : Promise<boolean> {
  const unite_Conversions = await prisma.unite_Conversion.findMany({
    where: { id: id }
  });

  return unite_Conversions.length > 0;
}*/

export async function read_Unite_Conversion(id: number, ) : Promise<Unite_Conversion_Type> {
  const fetched = await prisma.unite_Conversion.findUnique({
    where: { 
        id: id,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Unite_Conversion(unite_Conversion: Unite_Conversion_Type) : Promise<Unite_Conversion_Type> {
  const { id, ...unite_Conversion_Data } : Unite_Conversion_Type = unite_Conversion;
  
  const inserted = await prisma.unite_Conversion.create({
    data: unite_Conversion_Data
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Unite_Conversion(unite_Conversion: any) : Promise<Unite_Conversion_Type> {
  const { id, ...unite_Conversion_Data } : any = unite_Conversion;
  
  const updated = await prisma.unite_Conversion.update({
    where: {
        id: unite_Conversion.id,
      },
    data: unite_Conversion_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Unite_Conversion(id: number, ) : Promise<Unite_Conversion_Type> {
  const deleted = await prisma.unite_Conversion.delete({
    where: { 
        id: id,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}