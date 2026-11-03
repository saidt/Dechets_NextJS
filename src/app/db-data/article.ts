'use server'

import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { Article_Type } from "@/types/article";

export async function article_Count(whereClause: any) : Promise<number> {
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.article.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function article_List(params: PrismaQuery) : Promise<any[]> {
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {}} = params;
  const rows = await prisma.article.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

/*async function existsArticle(id: number) : Promise<boolean> {
  const articles = await prisma.article.findMany({
    where: { id: id }
  });

  return articles.length > 0;
}*/

export async function read_Article(code: string, ) : Promise<Article_Type> {
  const fetched = await prisma.article.findUnique({
    where: { 
        code: code,
      },
  })

  return JSON.parse(JSON.stringify(fetched));
}

export async function create_Article(article: Article_Type) : Promise<Article_Type> {
  const inserted = await prisma.article.create({
    data: article
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_Article(article: any) : Promise<Article_Type> {
  const { code, ...articleData } : any = article;
  
  const updated = await prisma.article.update({
    where: {
        code: article.code,
      },
    data: articleData
  })
  return JSON.parse(JSON.stringify(updated));
}

export async function delete_Article(code: string, ) : Promise<Article_Type> {
  const deleted = await prisma.article.delete({
    where: { 
        code: code,
      },
  })
  return JSON.parse(JSON.stringify(deleted));
}