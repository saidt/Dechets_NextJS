import { Column, Sort } from '@/lib/types';
import { z } from 'zod';
import { Article_Type } from './article';

export const ARTICLE_DECHET_COEFF_TABLE_NAME : string = 'dbo.ARTICLE_DECHET_COEFF'
export const ARTICLE_DECHET_COEFF_FETCH_URL : string = "/api/protected/article-dechet-coeff"
export const ARTICLE_DECHET_COEFF_URL : string = "/protected/article-dechet-coeff"
export const ARTICLE_DECHET_COEFF_MODEL_NAME : string = 'Coéfficient des articles déchets'
export const ARTICLE_DECHET_COEFF_LIST_TITLE : string = 'Coéfficients des articles déchets'
export const ARTICLE_DECHET_COEFF_SHOW_TITLE : string = 'Article_Dechet_Coeff'
export const ARTICLE_DECHET_COEFF_DEFAULT_SORT : Sort<Article_Dechet_Coeff_Type> =  { field: 'article_code', direction: 'asc' }

export type Article_Dechet_Coeff_Type = {
  article_code: string,
  coeff: number,
  article?: Article_Type
};

export const Empty_Article_Dechet_Coeff : Article_Dechet_Coeff_Type = {
  article_code: '',
  coeff: 0,
};
 	
export const article_Dechet_Coeff_Schema = z.object({
  article_code: z.string().min(1, "Value is required"),
  coeff: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
});

export type Article_Dechet_Coeff_FormData = z.infer<typeof article_Dechet_Coeff_Schema>;

export const article_Dechet_Coeff_Columns: Column<Article_Dechet_Coeff_Type>[] = [
  {
    accessor: "article_code" as keyof Article_Dechet_Coeff_Type,
    header: "Article",
    width: 100,
    meta: { isPrimaryKey: true }
  },
  {
    accessor: "article.designation" as keyof Article_Dechet_Coeff_Type,
    header: "Désignation",
    width: 300,
    accessorFn: (row: Article_Dechet_Coeff_Type) => row?.article?.designation || "",
  },
  {
    accessor: "coeff" as keyof Article_Dechet_Coeff_Type,
    header: "Coéfficient",
    width: 100,
    meta: { align: 'right', decimals: 2 },
  },
];

