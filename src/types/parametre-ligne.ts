import { Column, Sort } from '@/lib/types';
import { z } from 'zod';

export const PARAMETRE_LIGNE_TABLE_NAME : string = 'dbo.PARAMETRE_LIGNE'
export const PARAMETRE_LIGNE_CHILD_URL : string = "ligne"
export const PARAMETRE_LIGNE_URL : string = "/protected/parametre"
export const PARAMETRE_LIGNE_MODEL_NAME : string = 'Parametre_Ligne'
export const PARAMETRE_LIGNE_LIST_TITLE : string = 'Paramètres tables lignes'
export const PARAMETRE_LIGNE_SHOW_TITLE : string = 'Paramètres tables ligne'
export const PARAMETRE_LIGNE_DEFAULT_SORT : Sort<Parametre_Ligne_Type> =  { field: 'id', direction: 'asc' }

export type Parametre_Ligne_Type = {
  id: number,
  parametre_rubrique: string,
  code: string,
  designation: string | null,
};

export const Empty_Parametre_Ligne : Parametre_Ligne_Type = {
  id: 0,
  parametre_rubrique: '',
  code: '',
  designation: '',
};
 	
export const parametre_Ligne_Schema = z.object({
  id: z.coerce.number(),
  parametre_rubrique: z.string().min(1, "Value is required"),
  code: z.string().min(1, "Value is required"),
  designation: z.string().nullable(),
});

export type Parametre_Ligne_FormData = z.infer<typeof parametre_Ligne_Schema>;

export const parametre_Ligne_Columns: Column<Parametre_Ligne_Type>[] = [
  {
    accessor: "id" as keyof Parametre_Ligne_Type,
    header: "Id",
    width: 100,
    meta: { isPrimaryKey: true, align: "right" },
  },
  {
    accessor: "parametre_rubrique" as keyof Parametre_Ligne_Type,
    header: "Rubrique",
    width: 100,
  },
  {
    accessor: "code" as keyof Parametre_Ligne_Type,
    header: "Code",
    width: 100,
  },
  {
    accessor: "designation" as keyof Parametre_Ligne_Type,
    header: "Désignation",
    width: 300,
  },
];

