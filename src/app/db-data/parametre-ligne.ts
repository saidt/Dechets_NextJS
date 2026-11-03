'use server'

import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Parametre_Ligne_Type } from "@/types/parametre-ligne";

export async function parametre_Ligne_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.parametre_Ligne.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function parametre_Ligne_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.parametre_Ligne.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsParametre_Ligne(id: number) : Promise<boolean> {
  const parametre_Lignes = await prisma.parametre_Ligne.findMany({
    where: { id: id }
  });

  return parametre_Lignes.length > 0;
}*/

export async function read_Parametre_Ligne(id: number, ) : Promise<Parametre_Ligne_Type> {
  const fetched = await prisma.parametre_Ligne.findUnique({
    where: { 
        id: id,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Parametre_Ligne(parametre_Ligne: Parametre_Ligne_Type) : Promise<Parametre_Ligne_Type> {
  const { id, ...parametre_Ligne_Data } : Parametre_Ligne_Type = parametre_Ligne;
  
  const inserted = await prisma.parametre_Ligne.create({
    data: parametre_Ligne_Data
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Parametre_Ligne(parametre_Ligne: any) : Promise<Parametre_Ligne_Type> {
  const { id, ...parametre_Ligne_Data } : any = parametre_Ligne;
  
  const updated = await prisma.parametre_Ligne.update({
    where: {
        id: parametre_Ligne.id,
      },
    data: parametre_Ligne_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Parametre_Ligne(id: number, ) : Promise<Parametre_Ligne_Type> {
  const deleted = await prisma.parametre_Ligne.delete({
    where: { 
        id: id,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}