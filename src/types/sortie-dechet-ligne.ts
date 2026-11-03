import { Column, Sort } from '@/lib/types';
import { z } from 'zod';

export const SORTIE_DECHET_LIGNE_TABLE_NAME : string = 'dbo.SORTIE_DECHET_LIGNE'
export const SORTIE_DECHET_LIGNE_CHILD_URL : string = "ligne"
export const SORTIE_DECHET_LIGNE_URL : string = "/protected/sortie-dechet"
export const SORTIE_DECHET_LIGNE_MODEL_NAME : string = 'Sortie_Dechet_Ligne'
export const SORTIE_DECHET_LIGNE_LIST_TITLE : string = 'Lignes sortie déchets'
export const SORTIE_DECHET_LIGNE_SHOW_TITLE : string = 'Sortie_Dechet_Ligne'
export const SORTIE_DECHET_LIGNE_DEFAULT_SORT : Sort<Sortie_Dechet_Ligne_Type> =  { field: 'id', direction: 'asc' }

export type Sortie_Dechet_Ligne_Type = {
  id: number,
  sortie_dechet_numero: number,
  unite: string,
  pesee_numero: string | null,
  ligne_numero: number,
  article_code: string,
  article_designation: string,
  quantite: number,
  prix_vente: number,
  montant: number,
};

export const Empty_Sortie_Dechet_Ligne : Sortie_Dechet_Ligne_Type = {
  id: 0,
  sortie_dechet_numero: 0,
  unite: '',
  pesee_numero: null,
  ligne_numero: 0,
  article_code: '',
  article_designation: '',
  quantite: 0,
  prix_vente: 0,
  montant: 0,
};
 	
export const sortie_Dechet_Ligne_Schema = z.object({
  id: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  sortie_dechet_numero: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  unite: z.string().min(1, "Value is required"),
  pesee_numero: z.string().nullable(),
  ligne_numero: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  article_code: z.string().min(1, "Value is required"),
  article_designation: z.string().min(1, "Value is required"),
  quantite: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  prix_vente: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  montant: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
});

export type Sortie_Dechet_Ligne_FormData = z.infer<typeof sortie_Dechet_Ligne_Schema>;

export const sortie_Dechet_Ligne_Columns: Column<Sortie_Dechet_Ligne_Type>[] = [
  {
    accessor: "id" as keyof Sortie_Dechet_Ligne_Type,
    header: "Id",
    width: 50,
    meta: { isPrimaryKey: true, align: "right" },
  },
  {
    accessor: "ligne_numero" as keyof Sortie_Dechet_Ligne_Type,
    header: "Ligne",
    width: 100,
    meta: { align: "right" },
  },
  {
    accessor: "article_code" as keyof Sortie_Dechet_Ligne_Type,
    header: "Article",
    width: 100,
    meta: { align: 'left' },
  },
  {
    accessor: "article_designation" as keyof Sortie_Dechet_Ligne_Type,
    header: "Désignation",
    width: 200,
  },
  {
    accessor: "unite" as keyof Sortie_Dechet_Ligne_Type,
    header: "Unité",
    width: 50,
  },
  {
    accessor: "quantite" as keyof Sortie_Dechet_Ligne_Type,
    header: "Quantité",
    width: 60,
    meta: { align: "right" },
  },
  {
    accessor: "prix_vente" as keyof Sortie_Dechet_Ligne_Type,
    header: "P.U.V.",
    width: 120,
    meta: { align: "right", decimals: 2 },
  },
  {
    accessor: "montant" as keyof Sortie_Dechet_Ligne_Type,
    header: "Montant",
    width: 60,
    meta: { align: "right", decimals: 2 },
  }, 
  {
    accessor: "pesee_numero" as keyof Sortie_Dechet_Ligne_Type,
    header: "N° Pesée",
    width: 100,
  }
];