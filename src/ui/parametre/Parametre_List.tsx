"use client";

import {
  parametre_Columns,
  PARAMETRE_LIST_TITLE,
  PARAMETRE_TABLE_NAME,
  Parametre_Type,
} from "@/types/parametre";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import { fetch_All_Parametre_List, fetch_Parametre_List } from "@/fetch/parametre";

const Parametre_List = (props: CmListProps<Parametre_Type>) => {
  async function fetchRows(
    tableState: TableState<Parametre_Type>
  ): Promise<NextResponse> {
    return await fetch_Parametre_List(tableState);
  }

  async function fetchAllRows(
    tableState: TableState<Parametre_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Parametre_List(tableState);
  }
  
  return (
    <TitleCard title={ PARAMETRE_LIST_TITLE }>
      <GenericListPage<Parametre_Type> {...props}
        tableName={ PARAMETRE_TABLE_NAME }
        title={ PARAMETRE_LIST_TITLE }
        columns={parametre_Columns}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(parametre: Parametre_Type) => parametre.rubrique }
      />
    </TitleCard>
  )
};

export default Parametre_List;