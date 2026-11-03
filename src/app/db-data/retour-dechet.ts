'use server'

import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { consoleInfo } from "@/lib/clientLog";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Retour_Dechet_Type } from "@/types/retour-dechet";

/*export async function retourDechetCount() {
  const data = await prisma.retour_Dechet.count();
  return { count: data };
}*/

export async function retour_Dechet_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.retour_Dechet.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function retour_Dechet_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.retour_Dechet.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsRetour_Dechet(id: number) : Promise<boolean> {
  const retour_Dechets = await prisma.retour_Dechet.findMany({
    where: { id: id }
  });

  return retour_Dechets.length > 0;
}*/

export async function read_Retour_Dechet(numero: number) : Promise<Retour_Dechet_Type> {
  const fetched = await prisma.retour_Dechet.findUnique({
    where: { 
      numero: numero,
    },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Retour_Dechet(retour_Dechet: Retour_Dechet_Type) : Promise<Retour_Dechet_Type> {
  consoleInfo('create_Retour_Dechet retour_Dechet', retour_Dechet)
  
  const { numero, ...retour_Dechet_Data } : Retour_Dechet_Type = retour_Dechet;
  
  const inserted = await prisma.retour_Dechet.create({
    data: retour_Dechet_Data
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Retour_Dechet(retour_Dechet: any) : Promise<Retour_Dechet_Type> {
  const { numero, ...retour_Dechet_Data } : any = retour_Dechet;
  
  const updated = await prisma.retour_Dechet.update({
    where: {
        numero: retour_Dechet.numero,
      },
    data: retour_Dechet_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Retour_Dechet(numero: number) : Promise<Retour_Dechet_Type> {
  const deleted = await prisma.retour_Dechet.delete({
    where: { 
        numero: numero,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}

export async function retour_Dechet_Non_Valide_Count() {
  const data = await prisma.retour_Dechet.count({
    where: { valide: 'N' },
  });
  return { count: data };
}