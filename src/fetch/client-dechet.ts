import { CLIENT_DECHET_FETCH_URL, Client_Dechet_Type } from "@/types/client-dechet";
import { apiFetch } from "@/lib/apiFetch";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";

export async function fetch_Client_Dechet_List(
  tableState: TableState<Client_Dechet_Type>,
): Promise<NextResponse> {
  return await fetchData<Client_Dechet_Type>(CLIENT_DECHET_FETCH_URL, tableState);
}

export async function fetch_All_Client_Dechet_List(
  tableState: TableState<Client_Dechet_Type>,
): Promise<NextResponse> {
  return await fetchAllData<Client_Dechet_Type>(CLIENT_DECHET_FETCH_URL, tableState);
}

export async function fetch_Client_Dechet(code: string): Promise<Response> {
  return await apiFetch(`${CLIENT_DECHET_FETCH_URL}/${code}`);
}

export async function fetch_Client_Dechet_Reste_A_Payer(code: string): Promise<Response> {
  return await apiFetch(`${CLIENT_DECHET_FETCH_URL}/${code}/reste-a-payer`);
}