'use server'

import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Client_Dechet_Type } from "@/types/client-dechet";

export async function client_Dechet_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.client_Dechet.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function client_Dechet_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.client_Dechet.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsClient_Dechet(id: number) : Promise<boolean> {
  const client_Dechets = await prisma.client_Dechet.findMany({
    where: { id: id }
  });

  return client_Dechets.length > 0;
}*/

export async function read_Client_Dechet(code: string, ) : Promise<Client_Dechet_Type> {
  const fetched = await prisma.client_Dechet.findUnique({
    where: { 
        code: code,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Client_Dechet(client_Dechet: Client_Dechet_Type) : Promise<Client_Dechet_Type> {
  const inserted = await prisma.client_Dechet.create({
    data: client_Dechet
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Client_Dechet(client_Dechet: any) : Promise<Client_Dechet_Type> {
  const { code, ...client_DechetData } : any = client_Dechet;
  
  const updated = await prisma.client_Dechet.update({
    where: {
        code: client_Dechet.code,
      },
    data: client_DechetData
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Client_Dechet(code: string, ) : Promise<Client_Dechet_Type> {
  const deleted = await prisma.client_Dechet.delete({
    where: { 
        code: code,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}

export async function client_Dechet_Reste_A_Payer(code: string) {
  const result = await prisma.$queryRaw<{
    ANNEE: Number;
    MOIS: Number;
    NUMERO: Number;
    DATE_PIECE: Date;
    CLIENT_CODE: String;
    CLIENT_RAISON_SOCIALE: String;
    MONTANT: Number;
    MONTANT_REGLE: Number;
    RESTE_A_REGLER: Number;
  }[]
  >`exec dbo.CLIENT_DECHET_RESTE_A_PAYER ${code}`;

  if (!result) {
    return { error: "client_Dechet_Reste_A_Payer error" };
  }

  return result;
}