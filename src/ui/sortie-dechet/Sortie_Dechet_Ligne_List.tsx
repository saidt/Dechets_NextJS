"use client";

import {
  sortie_Dechet_Ligne_Columns,
  SORTIE_DECHET_LIGNE_LIST_TITLE,
  SORTIE_DECHET_LIGNE_TABLE_NAME,
  Sortie_Dechet_Ligne_Type,
} from "@/types/sortie-dechet-ligne";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import { NextResponse } from "next/server";
import { useParams } from "next/navigation";
import { fetch_All_Sortie_Dechet_Ligne_List, fetch_Sortie_Dechet_Ligne_List } from "@/fetch/sortie-dechet-ligne";

const Sortie_Dechet_Ligne_List = (props: CmListProps<Sortie_Dechet_Ligne_Type>) => {

  const { id } = useParams<{ id: string }>();
  
  async function fetchRows(
    tableState: TableState<Sortie_Dechet_Ligne_Type>
  ): Promise<NextResponse> {
    return await fetch_Sortie_Dechet_Ligne_List(tableState, Number(id));
  }

  async function fetchAllRows(
    tableState: TableState<Sortie_Dechet_Ligne_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Sortie_Dechet_Ligne_List(tableState, Number(id));
  }
  
  return (
    <GenericListPage<Sortie_Dechet_Ligne_Type> {...props}
      tableName={ SORTIE_DECHET_LIGNE_TABLE_NAME }
      title={ SORTIE_DECHET_LIGNE_LIST_TITLE }
      columns={sortie_Dechet_Ligne_Columns}
      fetchData={fetchRows}
      fetchAllData={fetchAllRows}
      getId={(sortie_Dechet_Ligne: Sortie_Dechet_Ligne_Type) => sortie_Dechet_Ligne.id }
      childUrl="ligne"
    />
  )
};

export default Sortie_Dechet_Ligne_List;