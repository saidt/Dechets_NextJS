import { REGLEMENT_DECHET_LIGNE_CHILD_URL, Reglement_Dechet_Ligne_Type } from "@/types/reglement-dechet-ligne";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";
import { REGLEMENT_DECHET_FETCH_URL } from "@/types/reglement-dechet"; // set to master

export async function fetch_Reglement_Dechet_Ligne_List(
  tableState: TableState<Reglement_Dechet_Ligne_Type>,
	numero: number,
): Promise<NextResponse> {
  return await fetchData<Reglement_Dechet_Ligne_Type>(`${ REGLEMENT_DECHET_FETCH_URL }/${ numero }/${ REGLEMENT_DECHET_LIGNE_CHILD_URL }`, tableState); // set to master
}

export async function fetch_All_Reglement_Dechet_Ligne_List(
  tableState: TableState<Reglement_Dechet_Ligne_Type>,
	numero: number,
): Promise<NextResponse> {
  return await fetchAllData<Reglement_Dechet_Ligne_Type>(`${ REGLEMENT_DECHET_FETCH_URL }/${ numero}/${ REGLEMENT_DECHET_LIGNE_CHILD_URL }`, tableState); // set to master
}