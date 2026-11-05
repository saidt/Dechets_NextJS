import { SORTIE_DECHET_FETCH_URL, Sortie_Dechet_Type } from "@/types/sortie-dechet";
import { apiFetch } from "@/lib/apiFetch";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";

export async function fetch_Sortie_Dechet_List(
  tableState: TableState<Sortie_Dechet_Type>,
): Promise<NextResponse> {
  return await fetchData<Sortie_Dechet_Type>(SORTIE_DECHET_FETCH_URL, tableState);
}

export async function fetch_All_Sortie_Dechet_List(
  tableState: TableState<Sortie_Dechet_Type>,
): Promise<NextResponse> {
  return await fetchAllData<Sortie_Dechet_Type>(SORTIE_DECHET_FETCH_URL, tableState);
}

export async function fetch_Sortie_Dechet(numero: number): Promise<Response> {
  return await apiFetch(`${ SORTIE_DECHET_FETCH_URL }/${numero}`);
}

export async function put_Sortie_Dechet(numero: number, data: Partial<Sortie_Dechet_Type> ): Promise<Response> {
  return await apiFetch(`${SORTIE_DECHET_FETCH_URL}/${numero}`, {
    method: "PUT",
    //headers: {'Content-Type': 'application/json' },
    //credentials: 'include',
    body: JSON.stringify({data}),
  });
}

export async function fetch_Sortie_Dechet_Count(): Promise<Response> {
  return await apiFetch(`${SORTIE_DECHET_FETCH_URL}/count`);
}

export async function fetch_Sortie_Dechet_Non_Valide_Count(): Promise<Response> {
  return await apiFetch(`${SORTIE_DECHET_FETCH_URL}/non-valide-count`);
}

export async function fetch_Sortie_Dechet_Count_DataSet(): Promise<Response> {
  return await apiFetch(`${SORTIE_DECHET_FETCH_URL}/count-ds`);
}

export async function fetch_Sortie_Dechet_Dernier_DataSet(): Promise<Response> {
  return await apiFetch(`${SORTIE_DECHET_FETCH_URL}/dernier`);
}

export async function fetch_Sortie_Dechet_Poids_DataSet(): Promise<Response> {
  return await apiFetch(`${SORTIE_DECHET_FETCH_URL}/poids-ds`);
}

export async function fetch_Sortie_Dechet_Maj_Prix_Detail(numero: number): Promise<Response> {
  return await apiFetch(`${SORTIE_DECHET_FETCH_URL}/${numero}/maj-prix-detail`, { method: "POST" });
}