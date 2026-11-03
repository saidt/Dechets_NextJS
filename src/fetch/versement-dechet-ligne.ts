import { VERSEMENT_DECHET_LIGNE_CHILD_URL, Versement_Dechet_Ligne_Type } from "@/types/versement-dechet-ligne";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";
import { VERSEMENT_DECHET_FETCH_URL } from "@/types/versement-dechet";

export async function fetch_Versement_Dechet_Ligne_List(
  tableState: TableState<Versement_Dechet_Ligne_Type>,
  numero: number,
): Promise<NextResponse> {
  return await fetchData<Versement_Dechet_Ligne_Type>(`${ VERSEMENT_DECHET_FETCH_URL }/${ numero }/${ VERSEMENT_DECHET_LIGNE_CHILD_URL }`, tableState); // set to master
}

export async function fetch_All_Versement_Dechet_Ligne_List(
  tableState: TableState<Versement_Dechet_Ligne_Type>,
  numero: number,
): Promise<NextResponse> {
  return await fetchAllData<Versement_Dechet_Ligne_Type>(`${ VERSEMENT_DECHET_FETCH_URL }/${ numero}/${ VERSEMENT_DECHET_LIGNE_CHILD_URL }`, tableState); // set to master
}