import { Column, Sort } from '@/lib/types';
import { z } from 'zod';

export const SORTIE_DECHET_DETAIL_TABLE_NAME : string = 'dbo.SORTIE_DECHET_DETAIL'
export const SORTIE_DECHET_DETAIL_CHILD_URL : string = "detail"
export const SORTIE_DECHET_DETAIL_URL : string = "/protected/sortie-dechet"
export const SORTIE_DECHET_DETAIL_MODEL_NAME : string = 'Sortie_Dechet_Detail'
export const SORTIE_DECHET_DETAIL_LIST_TITLE : string = 'Détails sortie déchets'
export const SORTIE_DECHET_DETAIL_SHOW_TITLE : string = 'Détail sortie déchets'
export const SORTIE_DECHET_DETAIL_DEFAULT_SORT : Sort<Sortie_Dechet_Detail_Type> =  { field: 'id', direction: 'asc' }

export type Sortie_Dechet_Detail_Type = {
  id: number,
  article_code: string,
  sortie_dechet_numero: number,
  ligne_numero: number,
  article_designation: string,
  poids: number,
  ml: number,
  prix_vente: number,
  montant: number,
};

export const Empty_Sortie_Dechet_Detail : Sortie_Dechet_Detail_Type = {
  id: 0,
  article_code: '',
  sortie_dechet_numero: 0,
  ligne_numero: 0,
  article_designation: '',
  poids: 0,
  ml: 0,
  prix_vente: 0,
  montant: 0,
};
 	
export const sortie_Dechet_Detail_Schema = z.object({
  id: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  article_code: z.string().min(1, "Value is required"),
  sortie_dechet_numero: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  ligne_numero: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  article_designation: z.string().min(1, "Value is required"),
  poids: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  ml: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  prix_vente: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  montant: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
});

export type Sortie_Dechet_Detail_FormData = z.infer<typeof sortie_Dechet_Detail_Schema>;

export const sortie_Dechet_Detail_Columns: Column<Sortie_Dechet_Detail_Type>[] = [
  {
    accessor: "id" as keyof Sortie_Dechet_Detail_Type,
    header: "Id",
    width: 70,
    meta: { isPrimaryKey: true, align: 'right' },
  },
  {
    accessor: "ligne_numero" as keyof Sortie_Dechet_Detail_Type,
    header: "Ligne",
    width: 50,
    meta: { align: 'right' },
  },
  {
    accessor: "article_code" as keyof Sortie_Dechet_Detail_Type,
    header: "Article",
    width: 100,
    meta: { align: 'left' },
  },
  {
    accessor: "article_designation" as keyof Sortie_Dechet_Detail_Type,
    header: "Désignation",
    width: 200,
  },
  {
    accessor: "poids" as keyof Sortie_Dechet_Detail_Type,
    header: "Poids",
    width: 60,
    meta: { align: 'right' },
  },
  {
    accessor: "ml" as keyof Sortie_Dechet_Detail_Type,
    header: "M.L.",
    width: 60,
    meta: { align: 'right' },
  },
  {
    accessor: "prix_vente" as keyof Sortie_Dechet_Detail_Type,
    header: "P.U.V.",
    width: 60,
    meta: { align: 'right', decimals: 2 },
  },
  {
    accessor: "montant" as keyof Sortie_Dechet_Detail_Type,
    header: "Montant",
    width: 100,
    meta: { align: 'right', decimals: 2 },
  },
];