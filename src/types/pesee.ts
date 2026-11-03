import { Column, Sort } from '@/lib/types';
import { z } from 'zod';

export const PESEE_TABLE_NAME : string = 'dbo.PESEE'

export const PESEE_FETCH_URL : string = "/api/protected/pesee"
export const PESEE_URL : string = "/protected/pesee"

export const PESEE_MODEL_NAME : string = 'Pesee'
export const PESEE_LIST_TITLE : string = 'Pesées'
export const PESEE_SHOW_TITLE : string = 'Pesée'
export const PESEE_DEFAULT_SORT : Sort<Pesee_Type> =  { field: 'numero_1', direction: 'asc' }

export type Pesee_Type = {
  numero_1: string,
  date_1: Date,
  heure_1: string,
  numero_2: string,
  date_2: Date,
  heure_2: string,
  client_raison_sociale: string | null,
  frs_raison_sociale: string | null,
  article_designation: string,
  immatriculation: string,
  poids_brut: number,
  tare: number,
  poids_net: number | null,
  sens: string,
};

export const Empty_Pesee : Pesee_Type = {
  numero_1: '',
  date_1: new Date(),
  heure_1: '',
  numero_2: '',
  date_2: new Date(),
  heure_2: '',
  client_raison_sociale: null,
  frs_raison_sociale: null,
  article_designation: '',
  immatriculation: '',
  poids_brut: 0,
  tare: 0,
  poids_net: null,
  sens: '',
};
 	
export const pesee_Schema = z.object({
  numero_1: z.string().min(1, "Value is required"),
  date_1: z.coerce.date(),
  heure_1: z.string().min(1, "Value is required"),
  numero_2: z.string().min(1, "Value is required"),
  date_2: z.coerce.date(),
  heure_2: z.string().min(1, "Value is required"),
  client_raison_sociale: z.string().nullable(),
  frs_raison_sociale: z.string().nullable(),
  article_designation: z.string().min(1, "Value is required"),
  immatriculation: z.string().min(1, "Value is required"),
  poids_brut: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  tare: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  poids_net: z.coerce.number(),
  sens: z.string().min(1, "Value is required"),
});

export type Pesee_FormData = z.infer<typeof pesee_Schema>;

export const pesee_Columns: Column<Pesee_Type>[] = [
  {
    accessor: "numero_1" as keyof Pesee_Type,
    header: "Numéro 1",
    width: 100,
    meta: { isPrimaryKey: true },
  },
  {
    accessor: "date_1" as keyof Pesee_Type,
    header: "Date 1",
    width: 100, 
  },
  {
    accessor: "heure_1" as keyof Pesee_Type,
    header: "Heure 1",
    width: 50, 
  },
  /*{
    accessor: "numero_2" as keyof Pesee_Type,
    header: "Numéro 2",
    width: 10, 
  },
  {
    accessor: "date_2" as keyof Pesee_Type,
    header: "Date 2",
    width: 10, 
  },
  {
    accessor: "heure_2" as keyof Pesee_Type,
    header: "Heure 2",
    width: 5, 
  },*/
  {
    accessor: "client_raison_sociale" as keyof Pesee_Type,
    header: "Client",
    width: 20, 
  },
  /*{
    accessor: "frs_raison_sociale" as keyof Pesee_Type,
    header: "Fournisseur",
    width: 40, 
  },*/
  {
    accessor: "article_designation" as keyof Pesee_Type,
    header: "Article",
    width: 200, 
  },
  {
    accessor: "immatriculation" as keyof Pesee_Type,
    header: "Matricule",
    width: 100, 
  },
  {
    accessor: "poids_brut" as keyof Pesee_Type,
    header: "Poids brut",
    width: 100, 
    meta: { align: 'right', decimals: 0 }
  },
  /*{
    accessor: "tare" as keyof Pesee_Type,
    header: "Tare",
    width: 10, 
    meta: { align: 'right', decimals: 0 }
  },*/
  {
    accessor: "poids_net" as keyof Pesee_Type,
    header: "Poids net",
    width: 100 , 
    meta: { align: 'right', decimals: 0 }
  },
  {
    accessor: "sens" as keyof Pesee_Type,
    header: "Sens",
    width: 50, 
  },
];