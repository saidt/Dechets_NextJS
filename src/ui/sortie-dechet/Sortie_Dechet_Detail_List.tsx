"use client";

import {
  sortie_Dechet_Detail_Columns,
  SORTIE_DECHET_DETAIL_LIST_TITLE,
  SORTIE_DECHET_DETAIL_TABLE_NAME,
  Sortie_Dechet_Detail_Type,
} from "@/types/sortie-dechet-detail";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import { NextResponse } from "next/server";
import { useParams } from "next/navigation";
import { fetch_All_Sortie_Dechet_Detail_List, fetch_Sortie_Dechet_Detail_List } from "@/fetch/sortie-dechet-detail";

const Sortie_Dechet_Detail_List = (props: CmListProps<Sortie_Dechet_Detail_Type>) => {
  
  const { id } = useParams<{ id: string }>();
  
  async function fetchRows(
    tableState: TableState<Sortie_Dechet_Detail_Type>
  ): Promise<NextResponse> {
    return await fetch_Sortie_Dechet_Detail_List(tableState, Number(id));
  }

  async function fetchAllRows(
    tableState: TableState<Sortie_Dechet_Detail_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Sortie_Dechet_Detail_List(tableState, Number(id));
  }
  
  return (
    <GenericListPage<Sortie_Dechet_Detail_Type> {...props}
      tableName={ SORTIE_DECHET_DETAIL_TABLE_NAME }
      title={ SORTIE_DECHET_DETAIL_LIST_TITLE }
      columns={sortie_Dechet_Detail_Columns}
      fetchData={fetchRows}
      fetchAllData={fetchAllRows}
      getId={(sortie_Dechet_Detail: Sortie_Dechet_Detail_Type) => sortie_Dechet_Detail.id }
      childUrl="detail"
    />
  )
};

export default Sortie_Dechet_Detail_List;