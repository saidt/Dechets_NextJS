import { PERIODE_FETCH_URL, Periode_Type } from "@/types/periode";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";

export async function fetch_Periode_List(
  tableState: TableState<Periode_Type>,
): Promise<NextResponse> {
  return await fetchData<Periode_Type>(PERIODE_FETCH_URL, tableState);
}

export async function fetch_All_Periode_List(
  tableState: TableState<Periode_Type>,
): Promise<NextResponse> {
  return await fetchAllData<Periode_Type>(PERIODE_FETCH_URL, tableState);
}