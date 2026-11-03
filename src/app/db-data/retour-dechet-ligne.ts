import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Retour_Dechet_Ligne_Type } from "@/types/retour-dechet-ligne";

export async function retour_Dechet_Ligne_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.retour_Dechet_Ligne.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function retour_Dechet_Ligne_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.retour_Dechet_Ligne.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsRetour_Dechet_Ligne(id: number) : Promise<boolean> {
  const retour_Dechet_Lignes = await prisma.retour_Dechet_Ligne.findMany({
    where: { id: id }
  });

  return retour_Dechet_Lignes.length > 0;
}*/

export async function read_Retour_Dechet_Ligne(id: number, ) : Promise<Retour_Dechet_Ligne_Type> {
  const fetched = await prisma.retour_Dechet_Ligne.findUnique({
    where: { 
      id: id,
    },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Retour_Dechet_Ligne(retour_Dechet_Ligne: Retour_Dechet_Ligne_Type) : Promise<Retour_Dechet_Ligne_Type> {
  const { id, ...retour_Dechet_Ligne_Data } : Retour_Dechet_Ligne_Type = retour_Dechet_Ligne;
  
  const inserted = await prisma.retour_Dechet_Ligne.create({
    data: retour_Dechet_Ligne_Data
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Retour_Dechet_Ligne(retour_Dechet_Ligne: any) : Promise<Retour_Dechet_Ligne_Type> {
  const { id, ...retour_Dechet_Ligne_Data } : any = retour_Dechet_Ligne;
  
  const updated = await prisma.retour_Dechet_Ligne.update({
    where: {
      id: retour_Dechet_Ligne.id,
    },
    data: retour_Dechet_Ligne_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Retour_Dechet_Ligne(id: number, ) : Promise<Retour_Dechet_Ligne_Type> {
  const deleted = await prisma.retour_Dechet_Ligne.delete({
    where: { 
      id: id,
    },
  })
  return JSON.parse(JSON.stringify(deleted));
}