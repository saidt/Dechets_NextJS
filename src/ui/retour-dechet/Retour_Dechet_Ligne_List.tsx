"use client";

import {
  retour_Dechet_Ligne_Columns,
  RETOUR_DECHET_LIGNE_LIST_TITLE,
  RETOUR_DECHET_LIGNE_TABLE_NAME,
  Retour_Dechet_Ligne_Type,
} from "@/types/retour-dechet-ligne";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import { NextResponse } from "next/server";
import { useParams } from "next/navigation";
import { fetch_All_Retour_Dechet_Ligne_List, fetch_Retour_Dechet_Ligne_List } from "@/fetch/retour-dechet-ligne";

const Retour_Dechet_Ligne_List = (props: CmListProps<Retour_Dechet_Ligne_Type>) => {

  const { id } = useParams<{ id: string }>();
  
  async function fetchRows(
    tableState: TableState<Retour_Dechet_Ligne_Type>
  ): Promise<NextResponse> {
    return await fetch_Retour_Dechet_Ligne_List(tableState, Number(id));
  }

  async function fetchAllRows(
    tableState: TableState<Retour_Dechet_Ligne_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Retour_Dechet_Ligne_List(tableState, Number(id));
  }
  
  return (
    <GenericListPage<Retour_Dechet_Ligne_Type> {...props}
      tableName={ RETOUR_DECHET_LIGNE_TABLE_NAME }
      title={ RETOUR_DECHET_LIGNE_LIST_TITLE }
      columns={retour_Dechet_Ligne_Columns}
      fetchData={fetchRows}
      fetchAllData={fetchAllRows}
      getId={(retour_Dechet_Ligne: Retour_Dechet_Ligne_Type) => retour_Dechet_Ligne.id }
      childUrl="ligne"
    />
  )
};

export default Retour_Dechet_Ligne_List;