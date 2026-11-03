import { Column, Sort } from "@/lib/types";
import { z } from "zod";
import { Sortie_Dechet_Type } from "./sortie-dechet";

export const REGLEMENT_DECHET_LIGNE_TABLE_NAME: string =
  "dbo.REGLEMENT_DECHET_LIGNE";
export const REGLEMENT_DECHET_LIGNE_CHILD_URL: string = "ligne";
export const REGLEMENT_DECHET_LIGNE_URL: string = "/protected/reglement-dechet";
export const REGLEMENT_DECHET_LIGNE_MODEL_NAME: string =
  "Reglement_Dechet_Ligne";
export const REGLEMENT_DECHET_LIGNE_LIST_TITLE: string =
  "Réglement déchets lignes";
export const REGLEMENT_DECHET_LIGNE_SHOW_TITLE: string =
  "Réglement déchets ligne";
export const REGLEMENT_DECHET_LIGNE_DEFAULT_SORT: Sort<Reglement_Dechet_Ligne_Type> =
  { field: "id", direction: "asc" };

export type Reglement_Dechet_Ligne_Type = {
  id: number;
  reglement_dechet_numero: number;
  sortie_dechet_numero: number;
  montant: number;
  sortie_dechet: Sortie_Dechet_Type | null;
};

export const Empty_Reglement_Dechet_Ligne: Reglement_Dechet_Ligne_Type = {
  id: 0,
  reglement_dechet_numero: 0,
  sortie_dechet_numero: 0,
  montant: 0,
  sortie_dechet: null,
};

export const reglement_Dechet_Ligne_Schema = z.object({
  id: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  reglement_dechet_numero: z.coerce
    .number()
    .refine((val) => !isNaN(val), "Value is required"),
  sortie_dechet_numero: z.coerce
    .number()
    .refine((val) => !isNaN(val), "Value is required"),
  montant: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
});

export type Reglement_Dechet_Ligne_FormData = z.infer<
  typeof reglement_Dechet_Ligne_Schema
>;

export const reglement_Dechet_Ligne_Columns: Column<Reglement_Dechet_Ligne_Type>[] = [
  {
    accessor: "id" as keyof Reglement_Dechet_Ligne_Type,
    header: "Id",
    width: 150,
    meta: { isPrimaryKey: true, align: 'right'}
  },
  {
    accessor: "reglement_dechet_numero" as keyof Reglement_Dechet_Ligne_Type,
    header: "N° réglement",
    width: 150,
    meta: { align: 'right'}
  },
  {
    accessor: "sortie_dechet_numero" as keyof Reglement_Dechet_Ligne_Type,
    header: "N° sortie",
    width: 150,
    meta: { align: 'right'}
  },
  {
    accessor: "sortie_dechet.client_code" as keyof Reglement_Dechet_Ligne_Type,
    header: "Client",
    width: 100,
    accessorFn: (row: Reglement_Dechet_Ligne_Type) =>
      row?.sortie_dechet?.client_code || "",
  },
  {
    accessor: "sortie_dechet.client_raison_sociale" as keyof Reglement_Dechet_Ligne_Type,
    header: "Raison sociale",
    width: 200,
    accessorFn: (row: Reglement_Dechet_Ligne_Type) =>
      row?.sortie_dechet?.client_raison_sociale || "",
  },
  {
    accessor: "sortie_dechet.date_piece" as keyof Reglement_Dechet_Ligne_Type,
    header: "Date sortie",
    width: 100,
    accessorFn: (row: Reglement_Dechet_Ligne_Type) =>
      row?.sortie_dechet?.date_piece || "",
  },
  {
    accessor: "montant" as keyof Reglement_Dechet_Ligne_Type,
    header: "Montant",
    width: 150,
    meta: { align: 'right', decimals: 2}
  },
];