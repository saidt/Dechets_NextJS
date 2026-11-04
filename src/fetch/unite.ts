import { UNITE_FETCH_URL, Unite_Type } from "@/types/unite";
import { apiFetch } from "@/lib/apiFetch";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";

export async function fetch_Unite_List(
  tableState: TableState<Unite_Type>,
): Promise<NextResponse> {
  return await fetchData<Unite_Type>(UNITE_FETCH_URL, tableState);
}

export async function fetch_All_Unite_List(
  tableState: TableState<Unite_Type>,
): Promise<NextResponse> {
  return await fetchAllData<Unite_Type>(UNITE_FETCH_URL, tableState);
}

export async function fetch_Unite(id: string, ): Promise<Response> {
  return await apiFetch(`${ UNITE_FETCH_URL }/${ id }`);
}