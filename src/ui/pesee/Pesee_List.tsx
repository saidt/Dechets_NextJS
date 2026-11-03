"use client";

import {
  pesee_Columns,
  PESEE_LIST_TITLE,
  PESEE_TABLE_NAME,
  Pesee_Type,
} from "@/types/pesee";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import { fetch_All_Pesee_List, fetch_Pesee_List } from "@/fetch/pesee";

const Pesee_List = (props: CmListProps<Pesee_Type>) => {
  async function fetchRows(
    tableState: TableState<Pesee_Type>
  ): Promise<NextResponse> {
    return await fetch_Pesee_List(tableState);
  }

  async function fetchAllRows(
    tableState: TableState<Pesee_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Pesee_List(tableState);
  }
  
  return (
    <TitleCard title={ PESEE_LIST_TITLE }>
      <GenericListPage<Pesee_Type> {...props}
        tableName={ PESEE_TABLE_NAME }
        title={ PESEE_LIST_TITLE }
        columns={ pesee_Columns }
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(pesee: Pesee_Type) => pesee.numero_1 }
      />
    </TitleCard>
  )
};

export default Pesee_List;