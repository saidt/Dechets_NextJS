import { SORTIE_DECHET_DETAIL_CHILD_URL, Sortie_Dechet_Detail_Type } from "@/types/sortie-dechet-detail";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";
import { SORTIE_DECHET_FETCH_URL } from "@/types/sortie-dechet";

export async function fetch_Sortie_Dechet_Detail_List(
  tableState: TableState<Sortie_Dechet_Detail_Type>,
  numero: number,
): Promise<NextResponse> {
  return await fetchData<Sortie_Dechet_Detail_Type>(`${ SORTIE_DECHET_FETCH_URL }/${ numero }/${ SORTIE_DECHET_DETAIL_CHILD_URL }`, tableState); // set to master
}

export async function fetch_All_Sortie_Dechet_Detail_List(
  tableState: TableState<Sortie_Dechet_Detail_Type>,
  numero: number,
): Promise<NextResponse> {
  return await fetchAllData<Sortie_Dechet_Detail_Type>(`${ SORTIE_DECHET_FETCH_URL }/${ numero}/${ SORTIE_DECHET_DETAIL_CHILD_URL }`, tableState); // set to master
}