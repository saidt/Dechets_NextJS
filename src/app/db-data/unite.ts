'use server'

import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";

import { Unite_Type } from "@/types/unite";

export async function unite_Count(whereClause: any) : Promise<number> {
  //consoleInfo('unite_Count whereClause: ', JSON.stringify(whereClause));
  const where: any = whereClause ? whereClause : {};
  //throw new Error('unite_Count volontary error !')
  const rowCount = await prisma.unite.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function unite_List(params: PrismaQuery) : Promise<any[]> {
  //consoleInfo('unite_List params: ', JSON.stringify(params));
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.unite.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

export async function read_Unite(code: string) : Promise<Unite_Type> {
  const fetched = await prisma.unite.findUnique({
    where: { code }
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Unite(unite: Unite_Type) : Promise<Unite_Type> {
  //consoleInfo('insertUnite unite: ', unite);  
  
  const inserted = await prisma.unite.create({
    data: unite
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Unite(unite: any) : Promise<Unite_Type> {
  //consoleInfo('update_Unite unite: ', unite);  
  const { code, ...uniteData } : any = unite;
  
  const updated = await prisma.unite.update({
    where: {
      code,
    },
    data: uniteData
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Unite(code: string) : Promise<Unite_Type> {
  //consoleInfo('delete_Unite unite: ', code);  

  const deleted = await prisma.unite.delete({
    where: {
      code,
    }
  })
  return JSON.parse(JSON.stringify(deleted));
}