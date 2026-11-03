import { PARAMETRE_LIGNE_CHILD_URL, Parametre_Ligne_Type } from "@/types/parametre-ligne";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";
import { PARAMETRE_FETCH_URL } from "@/types/parametre"; // set to master

export async function fetch_Parametre_Ligne_List(
  tableState: TableState<Parametre_Ligne_Type>,
	rubrique: string,
): Promise<NextResponse> {
  return await fetchData<Parametre_Ligne_Type>(`${ PARAMETRE_FETCH_URL }/${ rubrique }/${ PARAMETRE_LIGNE_CHILD_URL }`, tableState);
}

export async function fetch_All_Parametre_Ligne_List(
  tableState: TableState<Parametre_Ligne_Type>,
	rubrique: string,
): Promise<NextResponse> {
  return await fetchAllData<Parametre_Ligne_Type>(`${ PARAMETRE_FETCH_URL }/${ rubrique }/${ PARAMETRE_LIGNE_CHILD_URL }`, tableState); // set to master
}