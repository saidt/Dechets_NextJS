import { Column, Sort } from '@/lib/types';
import { z } from 'zod';

export const RETOUR_DECHET_TABLE_NAME : string = 'dbo.RETOUR_DECHET'
export const RETOUR_DECHET_FETCH_URL : string = "/api/protected/retour-dechet"
export const RETOUR_DECHET_URL : string = "/protected/retour-dechet"
export const RETOUR_DECHET_MODEL_NAME : string = 'Retour_Dechet'
export const RETOUR_DECHET_LIST_TITLE : string = 'Retour déchets'
export const RETOUR_DECHET_SHOW_TITLE : string = 'Retours déchets'
export const RETOUR_DECHET_DEFAULT_SORT : Sort<Retour_Dechet_Type> =  { field: 'numero', direction: 'asc' }

export type Retour_Dechet_Type = {
  numero: number,
  client_code: string,
  client_raison_sociale: string,
  date_piece: Date,
  montant: number,
  montant_regle: number,
  date_sortie: Date,
  valide: string,
  controle: string,
};

export const Empty_Retour_Dechet : Retour_Dechet_Type = {
  numero: 0,
  client_code: '',
  client_raison_sociale: '',
  //date_piece: new Date().toISOString(),
  date_piece: new Date(),
  montant: 0,
  montant_regle: 0,
  date_sortie: new Date(),
  valide: 'N',
  controle: 'N',
};
  
export const retour_Dechet_Schema = z.object({
  numero: z.coerce.number(),
  client_code: z.string().min(1, "Value is required"),
  client_raison_sociale: z.string().min(1, "Value is required"),
  date_piece: z.coerce.date(),
  montant: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  montant_regle: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  date_sortie: z.coerce.date(),
  valide: z.enum(["O", "N"]),
  controle: z.enum(["O", "N"]),
});

export type Retour_Dechet_FormData = z.infer<typeof retour_Dechet_Schema>;

export const retour_Dechet_Columns: Column<Retour_Dechet_Type>[] = [
  {
    accessor: "numero" as keyof Retour_Dechet_Type,
    header: "Numéro",
    width: 50,
    meta: { isPrimaryKey: true, align: 'right' },
  },
  {
    accessor: "client_code" as keyof Retour_Dechet_Type,
    header: "Client",
    width: 50,
  },
  {
    accessor: "client_raison_sociale" as keyof Retour_Dechet_Type,
    header: "Raison sociale",
    width: 250,
  },
  {
    accessor: "date_piece" as keyof Retour_Dechet_Type,
    header: "Date retour",
    width: 50,
  },
  {
    accessor: "montant" as keyof Retour_Dechet_Type,
    header: "Montant",
    width: 100,
    meta: { align: 'right', decimals: 2 },
  },
  {
    accessor: "montant_regle" as keyof Retour_Dechet_Type,
    header: "MT réglé",
    width: 120,
    meta: { align: 'right', decimals: 2 },
  },
  {
    accessor: "date_sortie" as keyof Retour_Dechet_Type,
    header: "Date sortie",
    width: 50,
  },
  {
    accessor: "valide" as keyof Retour_Dechet_Type,
    header: "Validé",
    width: 50,
  },
  {
    accessor: "controle" as keyof Retour_Dechet_Type,
    header: "Contrôlé",
    width: 50,
  },
];

export type Sortie_Dechet_Dernier_Type = {
  NUMERO: number;
  CLIENT_CODE: string;
  DATE_PIECE: Date;
  ARTICLE_CODE: string;
  ARTICLE_DESIGNATION: string;
  QUANTITE: number;
};