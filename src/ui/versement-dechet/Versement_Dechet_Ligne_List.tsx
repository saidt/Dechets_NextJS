"use client";

import {
  versement_Dechet_Ligne_Columns,
  VERSEMENT_DECHET_LIGNE_LIST_TITLE,
  VERSEMENT_DECHET_LIGNE_TABLE_NAME,
  Versement_Dechet_Ligne_Type,
} from "@/types/versement-dechet-ligne";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import { NextResponse } from "next/server";
import { useParams } from "next/navigation";
import { fetch_All_Versement_Dechet_Ligne_List, fetch_Versement_Dechet_Ligne_List } from "@/fetch/versement-dechet-ligne";

const Versement_Dechet_Ligne_List = (props: CmListProps<Versement_Dechet_Ligne_Type>) => {
  
  const { id } = useParams<{ id: string }>();
  
  async function fetchRows(
    tableState: TableState<Versement_Dechet_Ligne_Type>
  ): Promise<NextResponse> {
    return await fetch_Versement_Dechet_Ligne_List(tableState, Number(id)); 
  }

  async function fetchAllRows(
    tableState: TableState<Versement_Dechet_Ligne_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Versement_Dechet_Ligne_List(tableState, Number(id)); 
  }
  
  return (
    <GenericListPage<Versement_Dechet_Ligne_Type> {...props}
      tableName={ VERSEMENT_DECHET_LIGNE_TABLE_NAME }
      title={ VERSEMENT_DECHET_LIGNE_LIST_TITLE }
      columns={versement_Dechet_Ligne_Columns}
      fetchData={fetchRows}
      fetchAllData={fetchAllRows}
      getId={(versement_Dechet_Ligne: Versement_Dechet_Ligne_Type) => versement_Dechet_Ligne.id }
      childUrl="ligne"
    />
  )
};

export default Versement_Dechet_Ligne_List;