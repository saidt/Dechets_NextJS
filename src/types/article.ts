import { Column, Sort } from '@/lib/types';
import { z } from 'zod';

export const ARTICLE_TABLE_NAME : string = 'dbo.ARTICLE'
export const ARTICLE_FETCH_URL : string = "/api/protected/article"
export const ARTICLE_URL : string = "/protected/article"
export const ARTICLE_MODEL_NAME : string = 'Article'
export const ARTICLE_LIST_TITLE : string = 'Articles'
export const ARTICLE_SHOW_TITLE : string = 'Article'
export const ARTICLE_DEFAULT_SORT : Sort<Article_Type> =  { field: 'code', direction: 'asc' }

export type Article_Type = {
  code: string,
  designation: string,
  unite_stk: string,
  nature: string,
};

export const Empty_Article : Article_Type = {
  code: '',
  designation: '',
  unite_stk: '',
  nature: '',
};
 	
export const article_Schema = z.object({
  code: z.string().min(1, "Value is required"),
  designation: z.string().min(1, "Value is required"),
  unite_stk: z.string().min(1, "Value is required"),
  nature: z.string().min(1, "Value is required"),
});

export type Article_FormData = z.infer<typeof article_Schema>;

export const article_Columns: Column<Article_Type>[] = [
  { accessor: "code" as keyof Article_Type, header: "Code", width: 100, meta: { isPrimaryKey: true } },
  { accessor: "designation" as keyof Article_Type, header: "Désignation", width: 300 },
  { accessor: "unite_stk" as keyof Article_Type, header: "Unité stock", width: 150, },
  { accessor: "nature" as keyof Article_Type, header: "Nature", width: 100 },
];