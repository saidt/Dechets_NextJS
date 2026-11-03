import { Column, Sort } from '@/lib/types';
import { z } from 'zod';

export const ENVOI_FRS_DECHET_TABLE_NAME : string = 'dbo.ENVOI_FRS_DECHET'

export const ENVOI_FRS_DECHET_FETCH_URL : string = "/api/protected/envoi-frs-dechet"
export const ENVOI_FRS_DECHET_URL : string = "/protected/envoi-frs-dechet"

export const ENVOI_FRS_DECHET_MODEL_NAME : string = 'Envoi_Frs_Dechet'
export const ENVOI_FRS_DECHET_LIST_TITLE : string = 'Envois fournisseur déchets'
export const ENVOI_FRS_DECHET_SHOW_TITLE : string = 'Envoi fournisseur déchets'
export const ENVOI_FRS_DECHET_DEFAULT_SORT : Sort<Envoi_Frs_Dechet_Type> =  { field: 'id', direction: 'asc' }

export type Envoi_Frs_Dechet_Type = {
  id: number,
  article_code: string,
  annee: number,
  no_dos_exp: number,
  no_cmd_exp: number,
  date_cmd: Date,
  quantite: number,
  valide: string
};

export const Empty_Envoi_Frs_Dechet : Envoi_Frs_Dechet_Type = {
  id: 0,
  article_code: '',
  annee: 0,
  no_dos_exp: 0,
  no_cmd_exp: 0,
  date_cmd: new Date(),
  quantite: 0,
  valide: 'N'
};
 	
export const envoi_Frs_Dechet_Schema = z.object({
  id: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  article_code: z.string().min(1, "Value is required"),
  annee: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  no_dos_exp: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  no_cmd_exp: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  date_cmd: z.coerce.date(),
  quantite: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  valide: z.string().min(1, "Value is required")
});

export type Envoi_Frs_Dechet_FormData = z.infer<typeof envoi_Frs_Dechet_Schema>;

export const envoi_Frs_Dechet_Columns: Column<Envoi_Frs_Dechet_Type>[] = [
  {
    accessor: "id" as keyof Envoi_Frs_Dechet_Type,
    header: "Id",
    width: 50, 
    meta: { isPrimaryKey: true, align: 'right', decimals: 0 },
  },
  {
    accessor: "article_code" as keyof Envoi_Frs_Dechet_Type,
    header: "Article",
    width: 100, 
  },
  {
    accessor: "annee" as keyof Envoi_Frs_Dechet_Type,
    header: "Année",
    width: 40, 
    meta: { align: 'right', decimals: 0 }
  },
  {
    accessor: "no_dos_exp" as keyof Envoi_Frs_Dechet_Type,
    header: "Dossier",
    width: 50, 
    meta: { align: 'right', decimals: 0 }
  },
  {
    accessor: "no_cmd_exp" as keyof Envoi_Frs_Dechet_Type,
    header: "Commande",
    width: 50, 
    meta: { align: 'right', decimals: 0 }
  },
  {
    accessor: "date_cmd" as keyof Envoi_Frs_Dechet_Type,
    header: "Date Cmd",
    width: 120, 
  },
  {
    accessor: "quantite" as keyof Envoi_Frs_Dechet_Type,
    header: "Quantité",
    width: 100, 
    meta: { align: 'right', decimals: 0 }
  },
  {
    accessor: "valide" as keyof Envoi_Frs_Dechet_Type,
    header: "Validé",
    width: 60,
    meta: { align: 'center' }
  }
];