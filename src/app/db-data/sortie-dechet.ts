import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { consoleInfo } from "@/lib/clientLog";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Sortie_Dechet_Dernier_Type } from "@/types/retour-dechet";
import { Sortie_Dechet_Type } from "@/types/sortie-dechet";

/*export async function sortie_Dechet_Count() {
  const data = await prisma.sortie_Dechet.count();
  return { count: data };
}*/

export async function sortie_Dechet_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.sortie_Dechet.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function sortie_Dechet_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.sortie_Dechet.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsSortie_Dechet(id: number) : Promise<boolean> {
  const sortie_Dechets = await prisma.sortie_Dechet.findMany({
    where: { id: id }
  });

  return sortie_Dechets.length > 0;
}*/

export async function read_Sortie_Dechet(numero: number, ) : Promise<Sortie_Dechet_Type> {
  const fetched = await prisma.sortie_Dechet.findUnique({
    where: { 
      numero: numero,
    },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Sortie_Dechet(sortie_Dechet: Sortie_Dechet_Type) : Promise<Sortie_Dechet_Type> {
  consoleInfo('create_Sortie_Dechet  sortie_Dechet', sortie_Dechet)
  
  const { numero, ...sortie_Dechet_Data } : Sortie_Dechet_Type = sortie_Dechet;
  
  const inserted = await prisma.sortie_Dechet.create({
    data: sortie_Dechet_Data
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Sortie_Dechet(sortie_Dechet: any) : Promise<Sortie_Dechet_Type> {
  const { numero, ...sortie_Dechet_Data } : any = sortie_Dechet;
  
  const updated = await prisma.sortie_Dechet.update({
    where: {
        numero: sortie_Dechet.numero,
      },
    data: sortie_Dechet_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Sortie_Dechet(numero: number, ) : Promise<Sortie_Dechet_Type> {
  const deleted = await prisma.sortie_Dechet.delete({
    where: { 
        numero: numero,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}

export async function sortie_Dechet_Non_Valide_Count() {
  const data = await prisma.sortie_Dechet.count({
    where: { valide: 'N' },
  });
  return { count: data };
}

export async function sortie_Dechet_Count_DataSet() {
  const result = await prisma.$queryRaw<{
    ANNEE: number;
    MOIS: number;
    ANNEE_MOIS: string;
    NOMBRE: number,
  }[]
  >`select * from dbo.d_STAT_SORTIE_DECHET_NOMBRE_MOIS() order by ANNEE, MOIS`;

  if (!result) {
    return { error: "sortie_Dechet_Count_DataSet error" };
  }

  const anneeMois = [];
  const nombres = [];
  var total = 0

  for (let i = 0; i < result.length; i++) {
    anneeMois.push(result[i].ANNEE_MOIS.slice(2));
    nombres.push(result[i].NOMBRE);
    total = total + Number(result[i].NOMBRE)
  }

  return { anneeMois, nombres, total };
}

export async function sortie_Dechet_Poids_DataSet() {
  const result = await prisma.$queryRaw<{
    ANNEE: number;
    MOIS: number;
    ANNEE_MOIS: string;
    POIDS: number,
  }[]
  >`select * from dbo.d_STAT_SORTIE_DECHET_POIDS_MOIS() order by ANNEE, MOIS`;

  if (!result) {
    return { error: "sortie_Dechet_Poids_DataSet error" };
  }

  const anneeMois = [];
  const poids = [];
  var total = 0

  for (let i = 0; i < result.length; i++) {
    anneeMois.push(result[i].ANNEE_MOIS.slice(2));
    poids.push(result[i].POIDS);
    total = total + Number(result[i].POIDS)
  }

  return { anneeMois, poids, total };
}

export async function sortie_Dechet_Dernier() {
  const result = await prisma.$queryRaw<Sortie_Dechet_Dernier_Type[]>
    `select * from dbo.d_STAT_SORTIE_DECHET_DERNIER()`;

  if (!result) {
    return { error: "sortie_Dechet_Dernier error" };
  }
  return result;
}

export async function sortie_Dechet_Maj_Prix_Detail(numero: number) {
  const result = await prisma.$queryRaw<{
    SORTIE_DECHET_NUMERO: number;
    LIGNE_NUMERO: number;
    ARTICLE_CODE: string;
    ARTICLE_DESIGNATION: string;
    POIDS: number;
    ML: number;
    PRIX_VENTE: number;
    MONTANT: number;
  }[]
  >`exec dbo.SORTIE_DECHET_DETAIL_MAJ_PRIX_VENTE ${numero}`;

  if (!result) {
    return { error: "sortie_Dechet_Maj_Prix_Detail error" };
  }

  return result;
}