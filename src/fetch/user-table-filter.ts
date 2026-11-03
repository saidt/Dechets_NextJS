import { fetchAllData, fetchData } from "@/lib/fetchData";
import { TableState } from "@/lib/types";
import { USER_FETCH_URL } from "@/types/user";
import { USER_TABLE_FILTER_CHILD_URL, User_Table_Filter_Type } from "@/types/user-table-filter";
import { NextResponse } from "next/server";

export async function fetch_User_Table_Filter(
  tableState: TableState<User_Table_Filter_Type>,
  userId: string
): Promise<NextResponse> {
  return await fetchData<User_Table_Filter_Type>(`${USER_FETCH_URL}/${userId}/${USER_TABLE_FILTER_CHILD_URL}`, tableState);
}

export async function fetch_All_User_Table_Filter(
  tableState: TableState<User_Table_Filter_Type>,
  userId: string
): Promise<NextResponse> {
  return await fetchAllData<User_Table_Filter_Type>(`${USER_FETCH_URL}/${userId}/${USER_TABLE_FILTER_CHILD_URL}`, tableState);
}