"use client";

import {
  parametre_Ligne_Columns,
  PARAMETRE_LIGNE_LIST_TITLE,
  PARAMETRE_LIGNE_TABLE_NAME,
  Parametre_Ligne_Type,
} from "@/types/parametre-ligne";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import { NextResponse } from "next/server";
import { useParams } from "next/navigation";
import { fetch_All_Parametre_Ligne_List, fetch_Parametre_Ligne_List } from "@/fetch/parametre-ligne";

const Parametre_Ligne_List = (props: CmListProps<Parametre_Ligne_Type>) => {
  
  const { id } = useParams<{ id: string }>();
  
  async function fetchRows(
    tableState: TableState<Parametre_Ligne_Type>,
  ): Promise<NextResponse> {
    return await fetch_Parametre_Ligne_List(tableState, id);
  }

  async function fetchAllRows(
    tableState: TableState<Parametre_Ligne_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Parametre_Ligne_List(tableState, id);
  }
  
  return (
    <GenericListPage<Parametre_Ligne_Type> {...props}
      tableName={ PARAMETRE_LIGNE_TABLE_NAME }
      title={ PARAMETRE_LIGNE_LIST_TITLE }
      columns={parametre_Ligne_Columns}
      fetchData={fetchRows}
      fetchAllData={fetchAllRows}
      getId={(parametre_Ligne: Parametre_Ligne_Type) => parametre_Ligne.id }
      childUrl="ligne"
    />
  )
};

export default Parametre_Ligne_List;