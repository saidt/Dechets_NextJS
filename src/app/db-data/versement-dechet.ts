import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Versement_Dechet_Type } from "@/types/versement-dechet";

export async function versement_Dechet_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.versement_Dechet.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function versement_Dechet_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.versement_Dechet.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsVersement_Dechet(id: number) : Promise<boolean> {
  const versement_Dechets = await prisma.versement_Dechet.findMany({
    where: { id: id }
  });

  return versement_Dechets.length > 0;
}*/

export async function read_Versement_Dechet(numero: number, ) : Promise<Versement_Dechet_Type> {
  const fetched = await prisma.versement_Dechet.findUnique({
    where: { 
        numero: numero,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Versement_Dechet(versement_Dechet: Versement_Dechet_Type) : Promise<Versement_Dechet_Type> {
  const { numero, ...versement_Dechet_Data } : Versement_Dechet_Type = versement_Dechet;
  
  const inserted = await prisma.versement_Dechet.create({
    data: versement_Dechet_Data
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Versement_Dechet(versement_Dechet: any) : Promise<Versement_Dechet_Type> {
  const { numero, ...versement_Dechet_Data } : any = versement_Dechet;
  
  const updated = await prisma.versement_Dechet.update({
    where: {
        numero: versement_Dechet.numero,
      },
    data: versement_Dechet_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Versement_Dechet(numero: number, ) : Promise<Versement_Dechet_Type> {
  const deleted = await prisma.versement_Dechet.delete({
    where: { 
        numero: numero,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}