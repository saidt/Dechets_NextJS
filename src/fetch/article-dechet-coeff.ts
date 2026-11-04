import { ARTICLE_DECHET_COEFF_FETCH_URL, Article_Dechet_Coeff_Type } from "@/types/article-dechet-coeff";
import { apiFetch } from "@/lib/apiFetch";
import { TableState } from "@/lib/types";
import { fetchAllData, fetchData } from "@/lib/fetchData";
import { NextResponse } from "next/server";

export async function fetch_Article_Dechet_Coeff_List(
  tableState: TableState<Article_Dechet_Coeff_Type>,
): Promise<NextResponse> {
  return await fetchData<Article_Dechet_Coeff_Type>(ARTICLE_DECHET_COEFF_FETCH_URL, tableState);
}

export async function fetch_All_Article_Dechet_Coeff_List(
  tableState: TableState<Article_Dechet_Coeff_Type>,
): Promise<NextResponse> {
  return await fetchAllData<Article_Dechet_Coeff_Type>(ARTICLE_DECHET_COEFF_FETCH_URL, tableState);
}

export async function fetch_Article_Dechet_Coeff(article_code: string, ): Promise<Response> {
  return await apiFetch(`${ ARTICLE_DECHET_COEFF_FETCH_URL }/${ article_code }`);
}