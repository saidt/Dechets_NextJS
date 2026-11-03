'use server'

import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Reglement_Dechet_Ligne_Type } from "@/types/reglement-dechet-ligne";

export async function reglement_Dechet_Ligne_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.reglement_Dechet_Ligne.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function reglement_Dechet_Ligne_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.reglement_Dechet_Ligne.findMany({
    where,
    orderBy,
    skip,
    take,
    include: { sortie_dechet: true }
  });

  return Promise.resolve(rows);
}

/*async function existsReglement_Dechet_Ligne(id: number) : Promise<boolean> {
  const reglement_Dechet_Lignes = await prisma.reglement_Dechet_Ligne.findMany({
    where: { id: id }
  });

  return reglement_Dechet_Lignes.length > 0;
}*/

export async function read_Reglement_Dechet_Ligne(id: number, ) : Promise<Reglement_Dechet_Ligne_Type> {
  const fetched = await prisma.reglement_Dechet_Ligne.findUnique({
    where: { 
        id: id,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Reglement_Dechet_Ligne(reglement_Dechet_Ligne: Reglement_Dechet_Ligne_Type) : Promise<Reglement_Dechet_Ligne_Type> {
  const { id, sortie_dechet, ...reglement_Dechet_Ligne_Data } : Reglement_Dechet_Ligne_Type = reglement_Dechet_Ligne;
  
  const inserted = await prisma.reglement_Dechet_Ligne.create({
    data: reglement_Dechet_Ligne_Data
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Reglement_Dechet_Ligne(reglement_Dechet_Ligne: any) : Promise<Reglement_Dechet_Ligne_Type> {
  const { id, ...reglement_Dechet_Ligne_Data } : any = reglement_Dechet_Ligne;
  
  const updated = await prisma.reglement_Dechet_Ligne.update({
    where: {
        id: reglement_Dechet_Ligne.id,
      },
    data: reglement_Dechet_Ligne_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Reglement_Dechet_Ligne(id: number, ) : Promise<Reglement_Dechet_Ligne_Type> {
  const deleted = await prisma.reglement_Dechet_Ligne.delete({
    where: { 
        id: id,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}