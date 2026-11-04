import { ARTICLE_FETCH_URL, Article_Type } from "@/types/article";
import { apiFetch } from "@/lib/apiFetch";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";

export async function fetch_Article_List(
  tableState: TableState<Article_Type>,
): Promise<NextResponse> {
  return await fetchData<Article_Type>(ARTICLE_FETCH_URL, tableState);
}

export async function fetch_All_Article_List(
  tableState: TableState<Article_Type>,
): Promise<NextResponse> {
  return await fetchAllData<Article_Type>(ARTICLE_FETCH_URL, tableState);
}

export async function fetch_Article(id: string): Promise<Response> {
  return await apiFetch(`${ARTICLE_FETCH_URL}/${id}`);
}