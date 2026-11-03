"use client";

import {
  article_Dechet_Coeff_Columns,
  ARTICLE_DECHET_COEFF_LIST_TITLE,
  ARTICLE_DECHET_COEFF_TABLE_NAME,
  Article_Dechet_Coeff_Type,
} from "@/types/article-dechet-coeff";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import { fetch_All_Article_Dechet_Coeff_List, fetch_Article_Dechet_Coeff_List } from "@/fetch/article-dechet-coeff";

const Article_Dechet_Coeff_List = (props: CmListProps<Article_Dechet_Coeff_Type>) => {
  async function fetchRows(
    tableState: TableState<Article_Dechet_Coeff_Type>
  ): Promise<NextResponse> {
    return await fetch_Article_Dechet_Coeff_List(tableState);
  }

  async function fetchAllRows(
    tableState: TableState<Article_Dechet_Coeff_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Article_Dechet_Coeff_List(tableState);
  }
  
  return (
    <TitleCard title={ ARTICLE_DECHET_COEFF_LIST_TITLE }>
      <GenericListPage<Article_Dechet_Coeff_Type> {...props}
        tableName={ ARTICLE_DECHET_COEFF_TABLE_NAME }
        title={ ARTICLE_DECHET_COEFF_LIST_TITLE }
        columns={article_Dechet_Coeff_Columns}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(article_Dechet_Coeff: Article_Dechet_Coeff_Type) => article_Dechet_Coeff.article_code }
      />
    </TitleCard>
  )
};

export default Article_Dechet_Coeff_List;