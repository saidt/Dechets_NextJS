import { NextResponse } from "next/server";
import { removeEmptyValues } from "./lib";
import { PaginatedResponse, TableState } from "./types";
import { Scalar_Function_Param_Type, Stored_Proc_Param_Type } from "@/types/sp";
import { MAX_ALL_DATA_SIZE } from "./consts";
import { consoleInfo } from "./clientLog";

export async function fetchData<T extends Record<string, any>>(url: string, tableState: TableState<T>): Promise<NextResponse> {
  //consoleInfo('fetchData fetchData tableState: ', tableState)
  const { page, pageSize, sort, filter, quickSearch } = tableState;

  const cleanFilter = removeEmptyValues(filter)

  const urlParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sort: JSON.stringify(sort),
    filter: JSON.stringify(cleanFilter),
    quickSearch
  });

  consoleInfo('fetchData fetchData urlParams: ', urlParams)

  const response = await fetch(`${url}?${urlParams.toString()}`);
  const data = await response.json();
  return NextResponse.json<PaginatedResponse<T>>(data);
};

export async function fetchAllData<T extends Record<string, any>>(url: string, tableState: TableState<T>): Promise<NextResponse> {
  const allDataTableSate: TableState<T> = {
    page: 0,
    pageSize: MAX_ALL_DATA_SIZE,
    sort: tableState.sort,
    filter: tableState.filter,
    quickSearch: tableState.quickSearch
  }
  return await fetchData<T>(url, allDataTableSate)
}

export async function fetchStoredProc(spName: string, params: Stored_Proc_Param_Type[]): Promise<NextResponse> {
  const jsonParams = JSON.stringify(params)
  const response  = await fetch(`/api/protected/sp/exec?spName=${spName}&params=${jsonParams}`, {});
  const data = await response.json();
  return NextResponse.json(data);
}

export async function storedProcParams(spName: string): Promise<NextResponse> {
  const response  = await fetch(`/api/protected/sp/param?spName=${spName}`, {});
  const data = await response.json();
  return NextResponse.json(data);
}

export async function fetchScalarFunction(sfName: string, params: Scalar_Function_Param_Type[]): Promise<NextResponse> {
  const jsonParams = JSON.stringify(params)
  const response  = await fetch(`/api/protected/sf/exec?sfName=${sfName}&params=${jsonParams}`, {});
  const data = await response.json();
  return NextResponse.json(data);
}