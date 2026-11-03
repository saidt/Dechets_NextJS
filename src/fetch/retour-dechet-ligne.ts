import { RETOUR_DECHET_LIGNE_CHILD_URL, Retour_Dechet_Ligne_Type } from "@/types/retour-dechet-ligne";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";
import { RETOUR_DECHET_FETCH_URL } from "@/types/retour-dechet"; // set to master

export async function fetch_Retour_Dechet_Ligne_List(
  tableState: TableState<Retour_Dechet_Ligne_Type>,
  numero: number,
): Promise<NextResponse> {
  return await fetchData<Retour_Dechet_Ligne_Type>(`${ RETOUR_DECHET_FETCH_URL }/${ numero }/${ RETOUR_DECHET_LIGNE_CHILD_URL }`, tableState); // set to master
}

export async function fetch_All_Retour_Dechet_Ligne_List(
  tableState: TableState<Retour_Dechet_Ligne_Type>,
  numero: number,
): Promise<NextResponse> {
  return await fetchAllData<Retour_Dechet_Ligne_Type>(`${ RETOUR_DECHET_FETCH_URL }/${ numero}/${ RETOUR_DECHET_LIGNE_CHILD_URL }`, tableState); // set to master
}