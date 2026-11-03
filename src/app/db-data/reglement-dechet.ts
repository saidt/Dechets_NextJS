'use server'

import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Reglement_Dechet_Type } from "@/types/reglement-dechet";

export async function reglement_Dechet_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.reglement_Dechet.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function reglement_Dechet_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.reglement_Dechet.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsReglement_Dechet(id: number) : Promise<boolean> {
  const reglement_Dechets = await prisma.reglement_Dechet.findMany({
    where: { id: id }
  });

  return reglement_Dechets.length > 0;
}*/

export async function read_Reglement_Dechet(numero: number, ) : Promise<Reglement_Dechet_Type> {
  const fetched = await prisma.reglement_Dechet.findUnique({
    where: { 
        numero: numero,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Reglement_Dechet(reglement_Dechet: Reglement_Dechet_Type) : Promise<Reglement_Dechet_Type> {
  const { numero, ...reglement_Dechet_Data } : Reglement_Dechet_Type = reglement_Dechet;
  
  const inserted = await prisma.reglement_Dechet.create({
    data: reglement_Dechet_Data
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Reglement_Dechet(reglement_Dechet: any) : Promise<Reglement_Dechet_Type> {
  const { numero, ...reglement_Dechet_Data } : any = reglement_Dechet;
  
  const updated = await prisma.reglement_Dechet.update({
    where: {
        numero: reglement_Dechet.numero,
      },
    data: reglement_Dechet_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Reglement_Dechet(numero: number, ) : Promise<Reglement_Dechet_Type> {
  const deleted = await prisma.reglement_Dechet.delete({
    where: { 
        numero: numero,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}

export async function reglement_Dechet_Reste_A_Verser() {
  const result = await prisma.$queryRaw<{
    ANNEE: Number;
    MOIS: Number;
    NUMERO: Number;
    DATE_PIECE: Date;
    CLIENT_CODE: String;
    CLIENT_RAISON_SOCIALE: String;
    MONTANT: Number;
    MONTANT_VERSE: Number;
    RESTE_A_VERSER: Number;
  }[]
  >`exec dbo.REGLEMENT_DECHET_RESTE_A_VERSER`;

  if (!result) {
    return { error: "reglement_Dechet_Reste_A_Verser error" };
  }

  return result;
}