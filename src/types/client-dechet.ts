import { Column, Sort } from '@/lib/types';
import { z } from 'zod';

export const CLIENT_DECHET_TABLE_NAME : string = 'dbo.CLIENT_DECHET'
export const CLIENT_DECHET_FETCH_URL : string = "/api/protected/client-dechet"
export const CLIENT_DECHET_URL : string = "/protected/client-dechet"
export const CLIENT_DECHET_MODEL_NAME : string = 'Client_Dechet'
export const CLIENT_DECHET_LIST_TITLE : string = 'Clients déchets'
export const CLIENT_DECHET_SHOW_TITLE : string = 'Client déchets'
export const CLIENT_DECHET_DEFAULT_SORT : Sort<Client_Dechet_Type> =  { field: 'code', direction: 'asc' }

export type Client_Dechet_Type = {
  code: string,
  raison_sociale: string,
};

export const Empty_Client_Dechet : Client_Dechet_Type = {
  code: '',
  raison_sociale: '',
};
 	
export const client_Dechet_Schema = z.object({
  code: z.string().min(1, "Value is required"),
  raison_sociale: z.string().min(1, "Value is required"),
});

export type Client_Dechet_FormData = z.infer<typeof client_Dechet_Schema>;

export const client_Dechet_Columns: Column<Client_Dechet_Type>[] = [
  {
    accessor: "code" as keyof Client_Dechet_Type,
    header: "Code",
    width: 150,
    meta: { isPrimaryKey: true },
  },
  {
    accessor: "raison_sociale" as keyof Client_Dechet_Type,
    header: "Raison sociale",
    width: 300,
  },
];