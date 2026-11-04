import { ENVOI_FRS_DECHET_FETCH_URL, Envoi_Frs_Dechet_Type } from "@/types/envoi-frs-dechet";
import { apiFetch } from "@/lib/apiFetch";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";

export async function fetch_Envoi_Frs_Dechet_List(
  tableState: TableState<Envoi_Frs_Dechet_Type>,
): Promise<NextResponse> {
  return await fetchData<Envoi_Frs_Dechet_Type>(ENVOI_FRS_DECHET_FETCH_URL, tableState);
}

export async function fetch_All_Envoi_Frs_Dechet_List(
  tableState: TableState<Envoi_Frs_Dechet_Type>,
): Promise<NextResponse> {
  return await fetchAllData<Envoi_Frs_Dechet_Type>(ENVOI_FRS_DECHET_FETCH_URL, tableState);
}

export async function fetch_Envoi_Frs_Dechet(id: number, ): Promise<Response> {
  return await apiFetch(`${ ENVOI_FRS_DECHET_FETCH_URL }/${ id }`);
}

export async function fetch_Envoi_Frs_Dechet_Reste(): Promise<Response> {
  return await apiFetch(`${ENVOI_FRS_DECHET_FETCH_URL}/reste`)
}

export async function put_Envoi_Frs_Dechet(id: number, data: Partial<Envoi_Frs_Dechet_Type> ): Promise<Response> {
  return await apiFetch(`${ENVOI_FRS_DECHET_FETCH_URL}/${id}`, {
    method: "PUT",
    //headers: {'Content-Type': 'application/json' },
    //credentials: 'include',
    body: JSON.stringify({data}),
  });
}