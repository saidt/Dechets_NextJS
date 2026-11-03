'use server'

import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Envoi_Frs_Dechet_Type } from "@/types/envoi-frs-dechet";

export async function envoi_Frs_Dechet_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.envoi_Frs_Dechet.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function envoi_Frs_Dechet_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.envoi_Frs_Dechet.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsEnvoi_Frs_Dechet(id: number) : Promise<boolean> {
  const envoi_Frs_Dechets = await prisma.envoi_Frs_Dechet.findMany({
    where: { id: id }
  });

  return envoi_Frs_Dechets.length > 0;
}*/

export async function read_Envoi_Frs_Dechet(id: number, ) : Promise<Envoi_Frs_Dechet_Type> {
  const fetched = await prisma.envoi_Frs_Dechet.findUnique({
    where: { 
        id: id,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Envoi_Frs_Dechet(envoi_Frs_Dechet: Envoi_Frs_Dechet_Type) : Promise<Envoi_Frs_Dechet_Type> {
  const { id, ...envoi_Frs_Dechet_Data } : Envoi_Frs_Dechet_Type = envoi_Frs_Dechet;
  
  const inserted = await prisma.envoi_Frs_Dechet.create({
    data: envoi_Frs_Dechet_Data
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Envoi_Frs_Dechet(envoi_Frs_Dechet: any) : Promise<Envoi_Frs_Dechet_Type> {
  const { id, ...envoi_Frs_Dechet_Data } : any = envoi_Frs_Dechet;
  
  const updated = await prisma.envoi_Frs_Dechet.update({
    where: {
        id: envoi_Frs_Dechet.id,
      },
    data: envoi_Frs_Dechet_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Envoi_Frs_Dechet(id: number, ) : Promise<Envoi_Frs_Dechet_Type> {
  const deleted = await prisma.envoi_Frs_Dechet.delete({
    where: { 
        id: id,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}

export async function envoi_Frs_Dechet_Reste() {
  const result = await prisma.$queryRaw<{
    ANNEE: number;
    NO_DOS_EXP: number;
    NO_CMD_EXP: number;
    DATE_CMD: Date;
    ARTICLE_CODE: string;
    QUANTITE: number;
  }[]
  >`exec dbo.ENVOI_FRS_DECHET_RESTE`;

  if (!result) {
    return { error: "envoi_Frs_Dechet_Reste error" };
  }

  return result;
}