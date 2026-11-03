import { Column, Sort } from "@/lib/types";
import { z } from "zod";

export const UNITE_TABLE_NAME: string = "dbo.UNITE";
export const UNITE_FETCH_URL: string = "/api/protected/unite";
export const UNITE_URL: string = "/protected/unite";
export const UNITE_MODEL_NAME: string = "Unite";
export const UNITE_LIST_TITLE: string = "Unités";
export const UNITE_SHOW_TITLE: string = "Unité";
export const UNITE_DEFAULT_SORT: Sort<Unite_Type> = {
  field: "code",
  direction: "asc",
};

export type Unite_Type = {
  code: string;
  designation: string;
};

export const Empty_Unite: Unite_Type = {
  code: "",
  designation: "",
};

export const unite_Schema = z.object({
  code: z.string().min(1, "Code is required"),
  designation: z.string(),
});

export type Unite_FormData = z.infer<typeof unite_Schema>;

export const unite_Columns: Column<Unite_Type>[] = [
  {
    accessor: "code" as keyof Unite_Type,
    header: "Code",
    width: 150,
    meta: { isPrimaryKey: true },
  },
  {
    accessor: "designation" as keyof Unite_Type,
    header: "Désignation",
    width: 300,
  },
];