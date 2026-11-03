import { VERSEMENT_DECHET_FETCH_URL, Versement_Dechet_Type } from "@/types/versement-dechet";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";

export async function fetch_Versement_Dechet_List(
  tableState: TableState<Versement_Dechet_Type>,
): Promise<NextResponse> {
  return await fetchData<Versement_Dechet_Type>(VERSEMENT_DECHET_FETCH_URL, tableState);
}

export async function fetch_All_Versement_Dechet_List(
  tableState: TableState<Versement_Dechet_Type>,
): Promise<NextResponse> {
  return await fetchAllData<Versement_Dechet_Type>(VERSEMENT_DECHET_FETCH_URL, tableState);
}

export async function fetch_Versement_Dechet(numero: number, ): Promise<Response> {
  return await fetch(`${ VERSEMENT_DECHET_FETCH_URL }/${ numero }`);
}

export async function put_Versement_Dechet(numero: number, data: Partial<Versement_Dechet_Type>): Promise<Response> {
  return await fetch(`${VERSEMENT_DECHET_FETCH_URL}/${numero}`, {
    method: "PUT",
    //headers: {'Content-Type': 'application/json' },
    //credentials: 'include',
    body: JSON.stringify({data}),
  });
}