import { RETOUR_DECHET_FETCH_URL, Retour_Dechet_Type } from "@/types/retour-dechet";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";

export async function fetch_Retour_Dechet_List(
  tableState: TableState<Retour_Dechet_Type>,
): Promise<NextResponse> {
  return await fetchData<Retour_Dechet_Type>(RETOUR_DECHET_FETCH_URL, tableState);
}

export async function fetch_All_Retour_Dechet_List(
  tableState: TableState<Retour_Dechet_Type>,
): Promise<NextResponse> {
  return await fetchAllData<Retour_Dechet_Type>(RETOUR_DECHET_FETCH_URL, tableState);
}

export async function fetch_Retour_Dechet(numero: number, ): Promise<Response> {
  return await fetch(`${ RETOUR_DECHET_FETCH_URL }/${ numero }`);
}

export async function fetch_Retour_Dechet_Count(): Promise<Response> {
  return await fetch(`${RETOUR_DECHET_FETCH_URL}/count`);
}

export async function fetch_Retour_Dechet_Non_Valide_Count(): Promise<Response> {
  return await fetch(`${RETOUR_DECHET_FETCH_URL}/non-valide-count`);
}

export async function put_Retour_Dechet(numero: number, data: Partial<Retour_Dechet_Type> ): Promise<Response> {
  return await fetch(`${RETOUR_DECHET_FETCH_URL}/${numero}`, {
    method: "PUT",
    //headers: {'Content-Type': 'application/json' },
    //credentials: 'include',
    body: JSON.stringify({data}),
  });
}