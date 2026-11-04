import { CLIENT_DECHET_SLD_INI_FETCH_URL, Client_Dechet_Sld_Ini_Type } from "@/types/client-dechet-sld-ini";
import { apiFetch } from "@/lib/apiFetch";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";

export async function fetch_Client_Dechet_Sld_Ini_List(
  tableState: TableState<Client_Dechet_Sld_Ini_Type>,
): Promise<NextResponse> {
  return await fetchData<Client_Dechet_Sld_Ini_Type>(CLIENT_DECHET_SLD_INI_FETCH_URL, tableState);
}

export async function fetch_All_Client_Dechet_Sld_Ini_List(
  tableState: TableState<Client_Dechet_Sld_Ini_Type>,
): Promise<NextResponse> {
  return await fetchAllData<Client_Dechet_Sld_Ini_Type>(CLIENT_DECHET_SLD_INI_FETCH_URL, tableState);
}

export async function put_Client_Dechet_Sld_Ini(id: number, data: Partial<Client_Dechet_Sld_Ini_Type> ): Promise<Response> {
  return await apiFetch(`${CLIENT_DECHET_SLD_INI_FETCH_URL}/${id}`, {
    method: "PUT",
    //headers: {'Content-Type': 'application/json' },
    //credentials: 'include',
    body: JSON.stringify({data}),
  });
}