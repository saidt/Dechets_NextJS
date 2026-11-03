'use server'

import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Sortie_Dechet_Ligne_Type } from "@/types/sortie-dechet-ligne";

export async function sortie_Dechet_Ligne_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.sortie_Dechet_Ligne.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function sortie_Dechet_Ligne_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.sortie_Dechet_Ligne.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsSortie_Dechet_Ligne(id: number) : Promise<boolean> {
  const sortie_Dechet_Lignes = await prisma.sortie_Dechet_Ligne.findMany({
    where: { id: id }
  });

  return sortie_Dechet_Lignes.length > 0;
}*/

export async function read_Sortie_Dechet_Ligne(id: number, ) : Promise<Sortie_Dechet_Ligne_Type> {
  const fetched = await prisma.sortie_Dechet_Ligne.findUnique({
    where: { 
        id: id,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Sortie_Dechet_Ligne(sortie_Dechet_Ligne: Sortie_Dechet_Ligne_Type) : Promise<Sortie_Dechet_Ligne_Type> {
  const { id, ...sortie_Dechet_Ligne_Data } : Sortie_Dechet_Ligne_Type = sortie_Dechet_Ligne;
  
  const inserted = await prisma.sortie_Dechet_Ligne.create({
    data: sortie_Dechet_Ligne_Data
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Sortie_Dechet_Ligne(sortie_Dechet_Ligne: any) : Promise<Sortie_Dechet_Ligne_Type> {
  const { id, ...sortie_Dechet_Ligne_Data } : any = sortie_Dechet_Ligne;
  
  const updated = await prisma.sortie_Dechet_Ligne.update({
    where: {
        id: sortie_Dechet_Ligne.id,
      },
    data: sortie_Dechet_Ligne_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Sortie_Dechet_Ligne(id: number, ) : Promise<Sortie_Dechet_Ligne_Type> {
  const deleted = await prisma.sortie_Dechet_Ligne.delete({
    where: { 
        id: id,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}