import { formatDateTime } from "@/lib/date-utils";
import { Column, Sort } from "@/lib/types";
import { z } from "zod";

export const PERIODE_TABLE_NAME: string = "dbo.PERIODE";
export const PERIODE_FETCH_URL: string = "/api/protected/periode";
export const PERIODE_URL: string = "/protected/periode";
export const PERIODE_MODEL_NAME: string = "Periode";
export const PERIODE_LIST_TITLE: string = "Periodes";
export const PERIODE_SHOW_TITLE: string = "Periode";
export const PERIODE_DEFAULT_SORT: Sort<Periode_Type> = {
  field: "code",
  direction: "asc",
};

export type Periode_Type = {
  code: string;
  date_deb: Date;
  date_fin: Date;
};

export const Empty_Periode: Periode_Type = {
  code: "",
  date_deb: new Date(),
  date_fin: new Date(),
};

export const periode_Schema = z.object({
  code: z.string().min(1, "Value is required"),
  date_deb: z.coerce.date(),
  date_fin: z.coerce.date(),
});

export type Periode_FormData = z.infer<typeof periode_Schema>;

export const periode_Columns: Column<Periode_Type>[] = [
  {
    accessor: "code" as keyof Periode_Type,
    header: "Code",
    width: 100,
    meta: { isPrimaryKey: true },
  },
  {
    accessor: "date_deb" as keyof Periode_Type,
    header: "Date début",
    width: 175,
    accessorFn: (row: Periode_Type) => formatDateTime(new Date(row.date_deb)),
  },
  {
    accessor: "date_fin" as keyof Periode_Type,
    header: "Date fin",
    width: 175,
    accessorFn: (row: Periode_Type) => formatDateTime(new Date(row.date_fin)),
  },
];