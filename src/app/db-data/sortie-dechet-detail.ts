import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Sortie_Dechet_Detail_Type } from "@/types/sortie-dechet-detail";

export async function sortie_Dechet_Detail_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.sortie_Dechet_Detail.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function sortie_Dechet_Detail_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.sortie_Dechet_Detail.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsSortie_Dechet_Detail(id: number) : Promise<boolean> {
  const sortie_Dechet_Details = await prisma.sortie_Dechet_Detail.findMany({
    where: { id: id }
  });

  return sortie_Dechet_Details.length > 0;
}*/

export async function read_Sortie_Dechet_Detail(id: number, ) : Promise<Sortie_Dechet_Detail_Type> {
  const fetched = await prisma.sortie_Dechet_Detail.findUnique({
    where: { 
        id: id,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Sortie_Dechet_Detail(sortie_Dechet_Detail: Sortie_Dechet_Detail_Type) : Promise<Sortie_Dechet_Detail_Type> {
  const { id, ...sortie_Dechet_Detail_Data } : Sortie_Dechet_Detail_Type = sortie_Dechet_Detail;
  
  const inserted = await prisma.sortie_Dechet_Detail.create({
    data: sortie_Dechet_Detail_Data
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Sortie_Dechet_Detail(sortie_Dechet_Detail: any) : Promise<Sortie_Dechet_Detail_Type> {
  const { id, ...sortie_Dechet_Detail_Data } : any = sortie_Dechet_Detail;
  
  const updated = await prisma.sortie_Dechet_Detail.update({
    where: {
        id: sortie_Dechet_Detail.id,
      },
    data: sortie_Dechet_Detail_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Sortie_Dechet_Detail(id: number, ) : Promise<Sortie_Dechet_Detail_Type> {
  const deleted = await prisma.sortie_Dechet_Detail.delete({
    where: { 
        id: id,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}