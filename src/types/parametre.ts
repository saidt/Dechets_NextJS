import { Column, Sort } from "@/lib/types";
import { z } from "zod";

export const PARAMETRE_TABLE_NAME: string = "dbo.PARAMETRE";
export const PARAMETRE_FETCH_URL: string = "/api/protected/parametre";
export const PARAMETRE_URL: string = "/protected/parametre";
export const PARAMETRE_MODEL_NAME: string = "Parametre";
export const PARAMETRE_LIST_TITLE: string = "Paramètres";
export const PARAMETRE_SHOW_TITLE: string = "Parametre";
export const PARAMETRE_DEFAULT_SORT: Sort<Parametre_Type> = {
  field: "rubrique",
  direction: "asc",
};

export type Parametre_Type = {
  rubrique: string;
  designation: string | null;
};

export const Empty_Parametre: Parametre_Type = {
  rubrique: "",
  designation: null,
};

export const parametre_Schema = z.object({
  rubrique: z.string().min(1, "Value is required"),
  designation: z.string().nullable(),
});

export type Parametre_FormData = z.infer<typeof parametre_Schema>;

export const parametre_Columns: Column<Parametre_Type>[] = [
  {
    accessor: "rubrique" as keyof Parametre_Type,
    header: "Rubrique",
    width: 100,
    meta: { isPrimaryKey: true },
  },
  {
    accessor: "designation" as keyof Parametre_Type,
    header: "Désignation",
    width: 300,
  },
];