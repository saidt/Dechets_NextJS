"use client";

import {
  unite_Columns,
  UNITE_LIST_TITLE,
  UNITE_TABLE_NAME,
  Unite_Type,
} from "@/types/unite";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import { fetch_All_Unite_List, fetch_Unite_List } from "@/fetch/unite";

const Unite_List = (props: CmListProps<Unite_Type>) => {
  async function fetchRows(
    tableState: TableState<Unite_Type>
  ): Promise<NextResponse> {
    return await fetch_Unite_List(tableState);
  }

  async function fetchAllRows(
    tableState: TableState<Unite_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Unite_List(tableState);
  }
  
  return (
    <TitleCard title={UNITE_LIST_TITLE}>
      <GenericListPage<Unite_Type> {...props}
        tableName={UNITE_TABLE_NAME}
        title={UNITE_LIST_TITLE}
        columns={unite_Columns}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(unite: Unite_Type) => unite.code}
      />
    </TitleCard>
  )
};

export default Unite_List;