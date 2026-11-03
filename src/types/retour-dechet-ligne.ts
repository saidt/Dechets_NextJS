import { Column, Sort } from '@/lib/types';
import { z } from 'zod';

export const RETOUR_DECHET_LIGNE_TABLE_NAME : string = 'dbo.RETOUR_DECHET_LIGNE'
export const RETOUR_DECHET_LIGNE_CHILD_URL : string = "ligne"
export const RETOUR_DECHET_LIGNE_URL : string = "/protected/retour-dechet"
export const RETOUR_DECHET_LIGNE_MODEL_NAME : string = 'Retour_Dechet_Ligne'
export const RETOUR_DECHET_LIGNE_LIST_TITLE : string = 'Lignes retour déchets'
export const RETOUR_DECHET_LIGNE_SHOW_TITLE : string = 'Retour_Dechet_Ligne'
export const RETOUR_DECHET_LIGNE_DEFAULT_SORT : Sort<Retour_Dechet_Ligne_Type> =  { field: 'id', direction: 'asc' }

export type Retour_Dechet_Ligne_Type = {
  id: number,
  retour_dechet_numero: number,
  unite: string,
  ligne_numero: number,
  article_code: string,
  article_designation: string,
  quantite: number,
  prix_vente: number,
  montant: number,
};

export const Empty_Retour_Dechet_Ligne : Retour_Dechet_Ligne_Type = {
  id: 0,
  retour_dechet_numero: 0,
  unite: '',
  ligne_numero: 0,
  article_code: '',
  article_designation: '',
  quantite: 0,
  prix_vente: 0,
  montant: 0,
};
  
export const retour_Dechet_Ligne_Schema = z.object({
  id: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  retour_dechet_numero: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  unite: z.string().min(1, "Value is required"),
  ligne_numero: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  article_code: z.string().min(1, "Value is required"),
  article_designation: z.string().min(1, "Value is required"),
  quantite: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  prix_vente: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  montant: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
});

export type Retour_Dechet_Ligne_FormData = z.infer<typeof retour_Dechet_Ligne_Schema>;

export const retour_Dechet_Ligne_Columns: Column<Retour_Dechet_Ligne_Type>[] = [
  {
    accessor: "id" as keyof Retour_Dechet_Ligne_Type,
    header: "Id",
    width: 50,
    meta: { isPrimaryKey: true, align: "right" },
  },
  {
    accessor: "ligne_numero" as keyof Retour_Dechet_Ligne_Type,
    header: "Ligne",
    width: 100,
    meta: { align: "right" },
  },
  {
    accessor: "article_code" as keyof Retour_Dechet_Ligne_Type,
    header: "Article",
    width: 100,
  },
  {
    accessor: "article_designation" as keyof Retour_Dechet_Ligne_Type,
    header: "Désignation",
    width: 200,
  },
  {
    accessor: "unite" as keyof Retour_Dechet_Ligne_Type,
    header: "Unité",
    width: 50,
  },
  {
    accessor: "quantite" as keyof Retour_Dechet_Ligne_Type,
    header: "Quantité",
    width: 50,
    meta: { align: "right" },
  },
  {
    accessor: "prix_vente" as keyof Retour_Dechet_Ligne_Type,
    header: "P.U.V.",
    width: 120,
    meta: { align: "right", decimals: 2 },
  },
  {
    accessor: "montant" as keyof Retour_Dechet_Ligne_Type,
    header: "Montant",
    width: 60,
    meta: { align: "right", decimals: 2 },
  },
];

