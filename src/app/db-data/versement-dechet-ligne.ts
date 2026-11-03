'use server'

import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Versement_Dechet_Ligne_Type } from "@/types/versement-dechet-ligne";

export async function versement_Dechet_Ligne_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.versement_Dechet_Ligne.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function versement_Dechet_Ligne_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.versement_Dechet_Ligne.findMany({
    where,
    orderBy,
    skip,
    take,
    include: { reglement_dechet: true }
  });

  return Promise.resolve(rows);
}

/*async function existsVersement_Dechet_Ligne(id: number) : Promise<boolean> {
  const versement_Dechet_Lignes = await prisma.versement_Dechet_Ligne.findMany({
    where: { id: id }
  });

  return versement_Dechet_Lignes.length > 0;
}*/

export async function read_Versement_Dechet_Ligne(id: number, ) : Promise<Versement_Dechet_Ligne_Type> {
  const fetched = await prisma.versement_Dechet_Ligne.findUnique({
    where: { 
        id: id,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Versement_Dechet_Ligne(versement_Dechet_Ligne: Versement_Dechet_Ligne_Type) : Promise<Versement_Dechet_Ligne_Type> {
  const { id, reglement_dechet, ...versement_Dechet_Ligne_Data } : Versement_Dechet_Ligne_Type = versement_Dechet_Ligne;
  
  const inserted = await prisma.versement_Dechet_Ligne.create({
    data: versement_Dechet_Ligne_Data
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Versement_Dechet_Ligne(versement_Dechet_Ligne: any) : Promise<Versement_Dechet_Ligne_Type> {
  const { id, ...versement_Dechet_Ligne_Data } : any = versement_Dechet_Ligne;
  
  const updated = await prisma.versement_Dechet_Ligne.update({
    where: {
        id: versement_Dechet_Ligne.id,
      },
    data: versement_Dechet_Ligne_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Versement_Dechet_Ligne(id: number, ) : Promise<Versement_Dechet_Ligne_Type> {
  const deleted = await prisma.versement_Dechet_Ligne.delete({
    where: { 
        id: id,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}