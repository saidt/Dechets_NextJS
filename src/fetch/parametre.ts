import { PARAMETRE_FETCH_URL, Parametre_Type } from "@/types/parametre";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";

export async function fetch_Parametre_List(
  tableState: TableState<Parametre_Type>,
): Promise<NextResponse> {
  return await fetchData<Parametre_Type>(PARAMETRE_FETCH_URL, tableState);
}

export async function fetch_All_Parametre_List(
  tableState: TableState<Parametre_Type>,
): Promise<NextResponse> {
  return await fetchAllData<Parametre_Type>(PARAMETRE_FETCH_URL, tableState);
}