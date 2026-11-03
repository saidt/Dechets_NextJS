"use client";

import {
  envoi_Frs_Dechet_Columns,
  ENVOI_FRS_DECHET_LIST_TITLE,
  ENVOI_FRS_DECHET_TABLE_NAME,
  Envoi_Frs_Dechet_Type,
} from "@/types/envoi-frs-dechet";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import { fetch_All_Envoi_Frs_Dechet_List, fetch_Envoi_Frs_Dechet_List } from "@/fetch/envoi-frs-dechet";

const Envoi_Frs_Dechet_List = (props: CmListProps<Envoi_Frs_Dechet_Type>) => {
  async function fetchRows(
    tableState: TableState<Envoi_Frs_Dechet_Type>
  ): Promise<NextResponse> {
    return await fetch_Envoi_Frs_Dechet_List(tableState);
  }

  async function fetchAllRows(
    tableState: TableState<Envoi_Frs_Dechet_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Envoi_Frs_Dechet_List(tableState);
  }
  
  return (
    <TitleCard title={ ENVOI_FRS_DECHET_LIST_TITLE }>
      <GenericListPage<Envoi_Frs_Dechet_Type> {...props}
        tableName={ ENVOI_FRS_DECHET_TABLE_NAME }
        title={ ENVOI_FRS_DECHET_LIST_TITLE }
        columns={ envoi_Frs_Dechet_Columns }
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(envoi_Frs_Dechet: Envoi_Frs_Dechet_Type) => envoi_Frs_Dechet.id}
      />
    </TitleCard>
  )
};

export default Envoi_Frs_Dechet_List;