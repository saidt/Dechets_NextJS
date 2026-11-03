import { Column, Sort } from "@/lib/types";
import { z } from "zod";

export const VERSEMENT_DECHET_TABLE_NAME: string = "dbo.VERSEMENT_DECHET";

export const VERSEMENT_DECHET_FETCH_URL: string =
  "/api/protected/versement-dechet";
export const VERSEMENT_DECHET_URL: string = "/protected/versement-dechet";

export const VERSEMENT_DECHET_MODEL_NAME: string = "Versement_Dechet";
export const VERSEMENT_DECHET_LIST_TITLE: string = "Versements déchets";
export const VERSEMENT_DECHET_SHOW_TITLE: string = "Versement déchets";
export const VERSEMENT_DECHET_DEFAULT_SORT: Sort<Versement_Dechet_Type> = {
  field: "numero",
  direction: "asc",
};

export type Versement_Dechet_Type = {
  numero: number;
  date_piece: Date;
  valide: string;
};

export const Empty_Versement_Dechet: Versement_Dechet_Type = {
  numero: 0,
  date_piece: new Date(),
  valide: "",
};

export const versement_Dechet_Schema = z.object({
  numero: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  date_piece: z.coerce.date(),
  valide: z.string().min(1, "Value is required"),
});

export type Versement_Dechet_FormData = z.infer<typeof versement_Dechet_Schema>;

export const versement_Dechet_Columns: Column<Versement_Dechet_Type>[] = [
  {
    accessor: "numero" as keyof Versement_Dechet_Type,
    header: "Numéro",
    width: 100,
    meta: { isPrimaryKey: true, align: "right" },
  },
  {
    accessor: "date_piece" as keyof Versement_Dechet_Type,
    header: "Date",
    width: 150,
  },
  {
    accessor: "valide" as keyof Versement_Dechet_Type,
    header: "Validé",
    width: 100,
  },
];