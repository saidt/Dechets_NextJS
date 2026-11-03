'use server'

import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Parametre_Type } from "@/types/parametre";

export async function parametre_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.parametre.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function parametre_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.parametre.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsParametre(id: number) : Promise<boolean> {
  const parametres = await prisma.parametre.findMany({
    where: { id: id }
  });

  return parametres.length > 0;
}*/

export async function read_Parametre(rubrique: string, ) : Promise<Parametre_Type> {
  const fetched = await prisma.parametre.findUnique({
    where: { 
        rubrique: rubrique,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Parametre(parametre: Parametre_Type) : Promise<Parametre_Type> {
  const inserted = await prisma.parametre.create({
    data: parametre
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Parametre(parametre: any) : Promise<Parametre_Type> {
  const { rubrique, ...parametreData } : any = parametre;
  
  const updated = await prisma.parametre.update({
    where: {
        rubrique: parametre.rubrique,
      },
    data: parametreData
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Parametre(rubrique: string, ) : Promise<Parametre_Type> {
  const deleted = await prisma.parametre.delete({
    where: { 
        rubrique: rubrique,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}