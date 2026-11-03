import { Column, Sort } from '@/lib/types';
import { z } from 'zod';

export const REGLEMENT_DECHET_TABLE_NAME : string = 'dbo.REGLEMENT_DECHET'
export const REGLEMENT_DECHET_FETCH_URL : string = "/api/protected/reglement-dechet"
export const REGLEMENT_DECHET_URL : string = "/protected/reglement-dechet"
export const REGLEMENT_DECHET_MODEL_NAME : string = 'Reglement_Dechet'
export const REGLEMENT_DECHET_LIST_TITLE : string = 'Réglements déchets'
export const REGLEMENT_DECHET_SHOW_TITLE : string = 'Réglement déchets'
export const REGLEMENT_DECHET_DEFAULT_SORT : Sort<Reglement_Dechet_Type> =  { field: 'numero', direction: 'asc' }

export type Reglement_Dechet_Type = {
  numero: number,
  client_code: string,
  date_piece: Date,
  client_raison_sociale: string,
  montant: number,
  montant_regle: number,
  montant_verse: number,
  valide: string,
};

export const Empty_Reglement_Dechet : Reglement_Dechet_Type = {
  numero: 0,
  client_code: '',
  date_piece: new Date(),
  client_raison_sociale: '',
  montant: 0,
  montant_regle: 0,
  montant_verse: 0,
  valide: 'N',
};
 	
export const reglement_Dechet_Schema = z.object({
  numero: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  client_code: z.string().min(1, "Value is required"),
  date_piece: z.coerce.date(),
  client_raison_sociale: z.string().min(1, "Value is required"),
  montant: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  montant_regle: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  montant_verse: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  valide: z.enum(["O", "N"]),
});

export type Reglement_Dechet_FormData = z.infer<typeof reglement_Dechet_Schema>;

export const reglement_Dechet_Columns: Column<Reglement_Dechet_Type>[] = [
  {
    accessor: "numero" as keyof Reglement_Dechet_Type,
    header: "Numéro",
    width: 80,
    meta: { isPrimaryKey: true, align: 'right'}
  },
  {
    accessor: "client_code" as keyof Reglement_Dechet_Type,
    header: "Client",
    width: 100,
  },
  {
    accessor: "date_piece" as keyof Reglement_Dechet_Type,
    header: "Date",
    width: 100,
  },
  {
    accessor: "client_raison_sociale" as keyof Reglement_Dechet_Type,
    header: "Raison sociale",
    width: 250,
  },
  {
    accessor: "montant" as keyof Reglement_Dechet_Type,
    header: "Montant",
    width: 100,
    meta: { align: 'right', decimals: 2 },
  },
  {
    accessor: "montant_regle" as keyof Reglement_Dechet_Type,
    header: "MT réglé",
    width: 100,
    meta: { align: 'right', decimals: 2 },
  },
  {
    accessor: "montant_verse" as keyof Reglement_Dechet_Type,
    header: "MT versé",
    width: 100,
    meta: { align: 'right', decimals: 2 },
  },
  {
    accessor: "valide" as keyof Reglement_Dechet_Type,
    header: "Validé",
    width: 50,
  },
];