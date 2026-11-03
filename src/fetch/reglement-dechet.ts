import { REGLEMENT_DECHET_FETCH_URL, Reglement_Dechet_Type } from "@/types/reglement-dechet";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";

export async function fetch_Reglement_Dechet_List(
  tableState: TableState<Reglement_Dechet_Type>,
): Promise<NextResponse> {
  return await fetchData<Reglement_Dechet_Type>(REGLEMENT_DECHET_FETCH_URL, tableState);
}

export async function fetch_All_Reglement_Dechet_List(
  tableState: TableState<Reglement_Dechet_Type>,
): Promise<NextResponse> {
  return await fetchAllData<Reglement_Dechet_Type>(REGLEMENT_DECHET_FETCH_URL, tableState);
}

export async function fetch_Reglement_Dechet(numero: number): Promise<Response> {
  return await fetch(`${ REGLEMENT_DECHET_FETCH_URL }/${ numero }`);
}

export async function fetch_Reglement_Dechet_Reste_A_Verser(): Promise<Response> {
  return await fetch(`${REGLEMENT_DECHET_FETCH_URL}/reste-a-verser`)
}

export async function put_Reglement_Dechet(numero: number, data: Partial<Reglement_Dechet_Type> ): Promise<Response> {
  return await fetch(`${REGLEMENT_DECHET_FETCH_URL}/${numero}`, {
    method: "PUT",
    //headers: {'Content-Type': 'application/json' },
    //credentials: 'include',
    body: JSON.stringify({data}),
  });
}