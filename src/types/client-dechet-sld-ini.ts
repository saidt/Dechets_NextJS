import { Column, Sort } from '@/lib/types';
import { z } from 'zod';

export const CLIENT_DECHET_SLD_INI_TABLE_NAME : string = 'dbo.CLIENT_DECHET_SLD_INI'

export const CLIENT_DECHET_SLD_INI_FETCH_URL : string = "/api/protected/client-dechet-sld-ini"
export const CLIENT_DECHET_SLD_INI_URL : string = "/protected/client-dechet-sld-ini"

export const CLIENT_DECHET_SLD_INI_MODEL_NAME : string = 'Client_Dechet_Sld_Ini'
export const CLIENT_DECHET_SLD_INI_LIST_TITLE : string = 'Soldes initiaux des clients déchets'
export const CLIENT_DECHET_SLD_INI_SHOW_TITLE : string = "Solde initial d'un client déchets"
export const CLIENT_DECHET_SLD_INI_DEFAULT_SORT : Sort<Client_Dechet_Sld_Ini_Type> =  { field: 'id', direction: 'asc' }

export type Client_Dechet_Sld_Ini_Type = {
  id: number,
  article_code: string,
  client_code: string,
  date_debut: Date,
  quantite: number,
  valide: string
};

export const Empty_Client_Dechet_Sld_Ini : Client_Dechet_Sld_Ini_Type = {
  id: 0,
  article_code: '',
  client_code: '',
  date_debut: new Date(),
  quantite: 0,
  valide: 'N'
};
 	
export const client_Dechet_Sld_Ini_Schema = z.object({
  id: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  article_code: z.string().min(1, "Value is required"),
  client_code: z.string().min(1, "Value is required"),
  date_debut: z.coerce.date(),
  quantite: z.coerce.number().refine((val) => !isNaN(val), "Value is required"),
  valide: z.string().min(1, "Value is required")
});

export type Client_Dechet_Sld_Ini_FormData = z.infer<typeof client_Dechet_Sld_Ini_Schema>;

export const client_Dechet_Sld_Ini_Columns: Column<Client_Dechet_Sld_Ini_Type>[] = [
  {
    accessor: "id" as keyof Client_Dechet_Sld_Ini_Type,
    header: "Id",
    width: 100, 
    meta: { isPrimaryKey: true, align: 'right' },
  },
  {
    accessor: "article_code" as keyof Client_Dechet_Sld_Ini_Type,
    header: "Article",
    width: 120, 
    meta: { align: 'left' },
  },
  {
    accessor: "client_code" as keyof Client_Dechet_Sld_Ini_Type,
    header: "Client",
    width: 120, 
  },
  {
    accessor: "date_debut" as keyof Client_Dechet_Sld_Ini_Type,
    header: "Date début",
    width: 150, 
  },
  {
    accessor: "quantite" as keyof Client_Dechet_Sld_Ini_Type,
    header: "Quantité",
    width: 150, 
    meta: { align: 'right', decimals: 3 }
  },
  {
    accessor: "valide" as keyof Client_Dechet_Sld_Ini_Type,
    header: "Validé",
    width: 100,
    meta: { align: 'center' }
  }
];