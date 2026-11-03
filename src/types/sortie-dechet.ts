import { Column, Sort } from '@/lib/types';
import { z } from 'zod';

export const SORTIE_DECHET_TABLE_NAME : string = 'dbo.SORTIE_DECHET'
export const SORTIE_DECHET_FETCH_URL : string = "/api/protected/sortie-dechet"
export const SORTIE_DECHET_URL : string = "/protected/sortie-dechet"
export const SORTIE_DECHET_MODEL_NAME : string = 'Sortie_Dechet'
export const SORTIE_DECHET_LIST_TITLE : string = 'Sortie déchets'
export const SORTIE_DECHET_SHOW_TITLE : string = 'Sorties déchets'
export const SORTIE_DECHET_DEFAULT_SORT : Sort<Sortie_Dechet_Type> =  { field: 'numero', direction: 'asc' }

export type Sortie_Dechet_Type = {
  numero: number,
  client_code: string,
  client_raison_sociale: string,
  date_piece: Date,
  montant: number,
  montant_regle: number,
  valide: string,
  controle: string,
};

export const Empty_Sortie_Dechet : Sortie_Dechet_Type = {
  numero: 0,
  client_code: '',
  client_raison_sociale: '',
  date_piece: new Date(),
  montant: 0,
  montant_regle: 0,
  valide: 'N',
  controle: 'N',
};
 	
export const sortie_Dechet_Schema = z.object({
  numero: z.coerce.number(),
  client_code: z.string().min(1, "Value is required"),
  client_raison_sociale: z.string().min(1, "Value is required"),
  date_piece: z.coerce.date(),
  montant: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  montant_regle: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  valide: z.enum(["O", "N"]),
  controle: z.enum(["O", "N"]),
});

export type Sortie_Dechet_FormData = z.infer<typeof sortie_Dechet_Schema>;

export const sortie_Dechet_Columns: Column<Sortie_Dechet_Type>[] = [
  {
    accessor: "numero" as keyof Sortie_Dechet_Type,
    header: "Numéro",
    width: 50,
    meta: { isPrimaryKey: true, align: "right", decimals: 0 },
  },
  {
    accessor: "client_code" as keyof Sortie_Dechet_Type,
    header: "Client",
    width: 100,
  },
  {
    accessor: "client_raison_sociale" as keyof Sortie_Dechet_Type,
    header: "Raison sociale",
    width: 150,
  },
  {
    accessor: "date_piece" as keyof Sortie_Dechet_Type,
    header: "Date",
    width: 70,
  },
  {
    accessor: "montant" as keyof Sortie_Dechet_Type,
    header: "Montant",
    width: 80,
    meta: { align: "right", decimals: 2 },
  },
  {
    accessor: "montant_regle" as keyof Sortie_Dechet_Type,
    header: "MT réglé",
    width: 80,
    meta: { align: "right", decimals: 2 },
  }, 
  {
    accessor: "valide" as keyof Sortie_Dechet_Type,
    header: "Validé",
    width: 35,
  },
  {
    accessor: "controle" as keyof Sortie_Dechet_Type,
    header: "Contrôlé",
    width: 35,
  },
];