"use client";

import {
  periode_Columns,
  PERIODE_LIST_TITLE,
  PERIODE_TABLE_NAME,
  Periode_Type,
} from "@/types/periode";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import { fetch_All_Periode_List, fetch_Periode_List } from "@/fetch/periode";

const Periode_List = (props: CmListProps<Periode_Type>) => {
  async function fetchRows(
    tableState: TableState<Periode_Type>
  ): Promise<NextResponse> {
    return await fetch_Periode_List(tableState)
  }

  async function fetchAllRows(
    tableState: TableState<Periode_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Periode_List(tableState)
  }
  
  return (
    <TitleCard title={ PERIODE_LIST_TITLE }>
      <GenericListPage<Periode_Type> {...props}
        tableName={ PERIODE_TABLE_NAME }
        title={ PERIODE_LIST_TITLE }
        columns={periode_Columns}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(periode: Periode_Type) => periode.code }
      />
    </TitleCard>
  )
};

export default Periode_List;