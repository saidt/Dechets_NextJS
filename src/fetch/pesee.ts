import { PESEE_FETCH_URL, Pesee_Type } from "@/types/pesee";
import { apiFetch } from "@/lib/apiFetch";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";

export async function fetch_Pesee_List(
  tableState: TableState<Pesee_Type>,
): Promise<NextResponse> {
  return await fetchData<Pesee_Type>(PESEE_FETCH_URL, tableState);
}

export async function fetch_All_Pesee_List(
  tableState: TableState<Pesee_Type>,
): Promise<NextResponse> {
  return await fetchAllData<Pesee_Type>(PESEE_FETCH_URL, tableState);
}

export async function fetch_Pesee(numero_1: string): Promise<Response> {
  return await apiFetch(`${ PESEE_FETCH_URL }/${ numero_1 }`);
}