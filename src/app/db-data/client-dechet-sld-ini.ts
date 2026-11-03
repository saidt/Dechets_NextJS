'use server'

import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Client_Dechet_Sld_Ini_Type } from "@/types/client-dechet-sld-ini";

export async function client_Dechet_Sld_Ini_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.client_Dechet_Sld_Ini.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function client_Dechet_Sld_Ini_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.client_Dechet_Sld_Ini.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsClient_Dechet_Sld_Ini(id: number) : Promise<boolean> {
  const client_Dechet_Sld_Inis = await prisma.client_Dechet_Sld_Ini.findMany({
    where: { id: id }
  });

  return client_Dechet_Sld_Inis.length > 0;
}*/

export async function read_Client_Dechet_Sld_Ini(id: number, ) : Promise<Client_Dechet_Sld_Ini_Type> {
  const fetched = await prisma.client_Dechet_Sld_Ini.findUnique({
    where: { 
        id: id,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Client_Dechet_Sld_Ini(client_Dechet_Sld_Ini: Client_Dechet_Sld_Ini_Type) : Promise<Client_Dechet_Sld_Ini_Type> {
  const { id, ...client_Dechet_Sld_Ini_Data } : Client_Dechet_Sld_Ini_Type = client_Dechet_Sld_Ini;
  
  const inserted = await prisma.client_Dechet_Sld_Ini.create({
    data: client_Dechet_Sld_Ini_Data
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Client_Dechet_Sld_Ini(client_Dechet_Sld_Ini: any) : Promise<Client_Dechet_Sld_Ini_Type> {
  const { id, ...client_Dechet_Sld_Ini_Data } : any = client_Dechet_Sld_Ini;
  
  const updated = await prisma.client_Dechet_Sld_Ini.update({
    where: {
        id: client_Dechet_Sld_Ini.id,
      },
    data: client_Dechet_Sld_Ini_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Client_Dechet_Sld_Ini(id: number, ) : Promise<Client_Dechet_Sld_Ini_Type> {
  const deleted = await prisma.client_Dechet_Sld_Ini.delete({
    where: { 
        id: id,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}