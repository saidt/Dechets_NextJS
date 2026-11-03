import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Article_Dechet_Coeff_Type } from "@/types/article-dechet-coeff";

export async function article_Dechet_Coeff_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.article_Dechet_Coeff.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function article_Dechet_Coeff_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const coeffs = await prisma.article_Dechet_Coeff.findMany({
    where,
    orderBy,
    skip,
    take,
    include: {
      article: {
        select: {
          designation: true,
        },
      },
    },
  });
  
  return Promise.resolve(coeffs);
}

/*async function existsArticle_Dechet_Coeff(id: number) : Promise<boolean> {
  const article_Dechet_Coeffs = await prisma.article_Dechet_Coeff.findMany({
    where: { id: id }
  });

  return article_Dechet_Coeffs.length > 0;
}*/

export async function read_Article_Dechet_Coeff(article_code: string, ) : Promise<Article_Dechet_Coeff_Type> {
  const fetched = await prisma.article_Dechet_Coeff.findUnique({
    where: { 
        article_code: article_code,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Article_Dechet_Coeff(article_Dechet_Coeff: Article_Dechet_Coeff_Type) : Promise<Article_Dechet_Coeff_Type> {
   const { article, ...restData } : Article_Dechet_Coeff_Type = article_Dechet_Coeff;
  const inserted = await prisma.article_Dechet_Coeff.create({
    data: restData
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Article_Dechet_Coeff(article_Dechet_Coeff: any) : Promise<Article_Dechet_Coeff_Type> {
  const { article_code, ...article_Dechet_Coeff_Data } : any = article_Dechet_Coeff;
  
  const updated = await prisma.article_Dechet_Coeff.update({
    where: {
        article_code: article_Dechet_Coeff.article_code,
      },
    data: article_Dechet_Coeff_Data
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Article_Dechet_Coeff(article_code: string, ) : Promise<Article_Dechet_Coeff_Type> {
  const deleted = await prisma.article_Dechet_Coeff.delete({
    where: { 
        article_code: article_code,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}