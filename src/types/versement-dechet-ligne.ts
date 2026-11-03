import { Column, Sort } from '@/lib/types';
import { z } from 'zod';
import { Reglement_Dechet_Type } from './reglement-dechet';

export const VERSEMENT_DECHET_LIGNE_TABLE_NAME : string = 'dbo.VERSEMENT_DECHET_LIGNE'
export const VERSEMENT_DECHET_LIGNE_CHILD_URL : string = "ligne"
export const VERSEMENT_DECHET_LIGNE_URL : string = "/protected/versement-dechet"
export const VERSEMENT_DECHET_LIGNE_MODEL_NAME : string = 'Versement_Dechet_Ligne'
export const VERSEMENT_DECHET_LIGNE_LIST_TITLE : string = 'Versement déchets lignes'
export const VERSEMENT_DECHET_LIGNE_SHOW_TITLE : string = 'Versement déchets ligne'
export const VERSEMENT_DECHET_LIGNE_DEFAULT_SORT : Sort<Versement_Dechet_Ligne_Type> =  { field: 'id', direction: 'asc' }

export type Versement_Dechet_Ligne_Type = {
  id: number,
  reglement_dechet_numero: number,
  versement_dechet_numero: number,
  montant: number,
  reglement_dechet: Reglement_Dechet_Type | null,
};

export const Empty_Versement_Dechet_Ligne : Versement_Dechet_Ligne_Type = {
  id: 0,
  reglement_dechet_numero: 0,
  versement_dechet_numero: 0,
  montant: 0,
  reglement_dechet: null
};
 	
export const versement_Dechet_Ligne_Schema = z.object({
  id: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  reglement_dechet_numero: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  versement_dechet_numero: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  montant: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
});

export type Versement_Dechet_Ligne_FormData = z.infer<typeof versement_Dechet_Ligne_Schema>;

export const versement_Dechet_Ligne_Columns: Column<Versement_Dechet_Ligne_Type>[] = [
  {
    accessor: "id" as keyof Versement_Dechet_Ligne_Type,
    header: "Id",
    width: 100,
    meta: { isPrimaryKey: true, align: "right" },
  },
  {
    accessor: "reglement_dechet_numero" as keyof Versement_Dechet_Ligne_Type,
    header: "Réglement",
    width: 100,
    meta: { align: "right" },
  },

  {
    accessor:
      "reglement_dechet.client_code" as keyof Versement_Dechet_Ligne_Type,
    header: "Client",
    width: 100,
    accessorFn: (row: Versement_Dechet_Ligne_Type) =>
      row?.reglement_dechet?.client_code || "",
  },
  {
    accessor:
      "reglement_dechet.client_raison_sociale" as keyof Versement_Dechet_Ligne_Type,
    header: "Raison sociale",
    width: 200,
    accessorFn: (row: Versement_Dechet_Ligne_Type) =>
      row?.reglement_dechet?.client_raison_sociale || "",
  },
  {
    accessor:
      "reglement_dechet.date_piece" as keyof Versement_Dechet_Ligne_Type,
    header: "Date régl.",
    width: 100,
    accessorFn: (row: Versement_Dechet_Ligne_Type) =>
      row?.reglement_dechet?.date_piece || "",
  },

  {
    accessor: "montant" as keyof Versement_Dechet_Ligne_Type,
    header: "Montant",
    width: 150,
    meta: { align: "right", decimals: 2 },
  },
];