import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { ListResponse, Sort, TableState } from "@/lib/types";
import { NextResponse } from "next/server";

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export function httpListParams<T extends Record<string, any>>(
  searchParams: URLSearchParams,
  defaultSort:  Sort<T>
) : TableState<T> {
  const page = Number(searchParams.get("page") || 0);
  const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGE_SIZE);
  const sort = JSON.parse(searchParams.get("sort") || JSON.stringify(defaultSort));
  const filter = JSON.parse(searchParams.get("filter") || "{}");
  const quickSearch = searchParams.get("quickSearch") || '';

  return { page, pageSize, sort, filter, quickSearch }
}  

export async function httpList<T extends Record<string, any>>(
  rowsOperation: () => Promise<T[]>,
  countOperation: () => Promise<number>
): Promise<NextResponse> {
  var count : number
  var rows : T[]

  const fetchAll = async(): Promise<ListResponse> => {
    count = await countOperation()
    rows = await rowsOperation()
    return {rows, count}
  }
  
  const response = await fetchAll()
  //consoleInfo('httpList response:', response);
  return NextResponse.json({ data: response.rows, total: response.count });
}

export async function httpAction<T extends Record<string, any>>(
  operation: () => Promise<T>,
): Promise<NextResponse> {
  const response = await operation()
  //consoleInfo('httpAction response:', response);
  return NextResponse.json(response);
}