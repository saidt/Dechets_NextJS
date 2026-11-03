"use client";

import {
  reglement_Dechet_Ligne_Columns,
  REGLEMENT_DECHET_LIGNE_LIST_TITLE,
  REGLEMENT_DECHET_LIGNE_TABLE_NAME,
  Reglement_Dechet_Ligne_Type,
} from "@/types/reglement-dechet-ligne";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import { NextResponse } from "next/server";
import { useParams } from "next/navigation";
import { fetch_All_Reglement_Dechet_Ligne_List, fetch_Reglement_Dechet_Ligne_List } from "@/fetch/reglement-dechet-ligne";

const Reglement_Dechet_Ligne_List = (props: CmListProps<Reglement_Dechet_Ligne_Type>) => {
  
  const { id } = useParams<{ id: string }>();
  
  async function fetchRows(
    tableState: TableState<Reglement_Dechet_Ligne_Type>
  ): Promise<NextResponse> {
    return await fetch_Reglement_Dechet_Ligne_List(tableState, Number(id));
  }

  async function fetchAllRows(
    tableState: TableState<Reglement_Dechet_Ligne_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Reglement_Dechet_Ligne_List(tableState, Number(id));
  }
  
  return (
    <GenericListPage<Reglement_Dechet_Ligne_Type> {...props}
      tableName={ REGLEMENT_DECHET_LIGNE_TABLE_NAME }
      title={ REGLEMENT_DECHET_LIGNE_LIST_TITLE }
      columns={reglement_Dechet_Ligne_Columns}
      fetchData={fetchRows}
      fetchAllData={fetchAllRows}
      getId={(reglement_Dechet_Ligne: Reglement_Dechet_Ligne_Type) => reglement_Dechet_Ligne.id }
      childUrl="ligne"
    />
  )
};

export default Reglement_Dechet_Ligne_List;