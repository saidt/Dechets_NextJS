import { Column, Sort } from '@/lib/types';
import { z } from 'zod';

export const UNITE_CONVERSION_TABLE_NAME : string = 'dbo.UNITE_CONVERSION'

export const UNITE_CONVERSION_FETCH_URL : string = "/api/protected/unite-conversion"
export const UNITE_CONVERSION_URL : string = "/protected/unite-conversion"

export const UNITE_CONVERSION_MODEL_NAME : string = 'Unite_Conversion'
export const UNITE_CONVERSION_LIST_TITLE : string = "Conversions d'unités"
export const UNITE_CONVERSION_SHOW_TITLE : string = "Conversion d'unités"
export const UNITE_CONVERSION_DEFAULT_SORT : Sort<Unite_Conversion_Type> =  { field: 'id', direction: 'asc' }

export type Unite_Conversion_Type = {
  id: number,
  unite_source: string,
  unite_destination: string,
  coeff: number,
};

export const Empty_Unite_Conversion : Unite_Conversion_Type = {
  id: 0,
  unite_source: '',
  unite_destination: '',
  coeff: 0,
};
 	
export const unite_Conversion_Schema = z.object({
  id: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  unite_source: z.string().min(1, "Value is required"),
  unite_destination: z.string().min(1, "Value is required"),
  coeff: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
});

export type Unite_Conversion_FormData = z.infer<typeof unite_Conversion_Schema>;

export const unite_Conversion_Columns: Column<Unite_Conversion_Type>[] = [
  {
    accessor: "id" as keyof Unite_Conversion_Type,
    header: "id",
    width: 100,
    meta: { isPrimaryKey: true, align: "right" },
  },
  {
    accessor: "unite_source" as keyof Unite_Conversion_Type,
    header: "Unité source",
    width: 150,
  },
  {
    accessor: "unite_destination" as keyof Unite_Conversion_Type,
    header: "Unité destination",
    width: 200,
  },
  {
    accessor: "coeff" as keyof Unite_Conversion_Type,
    header: "Coéfficient",
    width: 100,
    meta: { align: "right", decimals: 6 },
  },
];