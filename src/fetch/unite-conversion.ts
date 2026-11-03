import { UNITE_CONVERSION_FETCH_URL, Unite_Conversion_Type } from "@/types/unite-conversion";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";

export async function fetch_Unite_Conversion_List(
  tableState: TableState<Unite_Conversion_Type>,
): Promise<NextResponse> {
  return await fetchData<Unite_Conversion_Type>(UNITE_CONVERSION_FETCH_URL, tableState);
}

export async function fetch_All_Unite_Conversion_List(
  tableState: TableState<Unite_Conversion_Type>,
): Promise<NextResponse> {
  return await fetchAllData<Unite_Conversion_Type>(UNITE_CONVERSION_FETCH_URL, tableState);
}