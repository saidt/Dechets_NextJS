"use client";

import {
  client_Dechet_Sld_Ini_Columns,
  CLIENT_DECHET_SLD_INI_LIST_TITLE,
  CLIENT_DECHET_SLD_INI_TABLE_NAME,
  Client_Dechet_Sld_Ini_Type,
} from "@/types/client-dechet-sld-ini";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import { fetch_All_Client_Dechet_Sld_Ini_List, fetch_Client_Dechet_Sld_Ini_List } from "@/fetch/client-dechet-sld-ini";

const Client_Dechet_Sld_Ini_List = (props: CmListProps<Client_Dechet_Sld_Ini_Type>) => {
  async function fetchRows(
    tableState: TableState<Client_Dechet_Sld_Ini_Type>
  ): Promise<NextResponse> {
    return await fetch_Client_Dechet_Sld_Ini_List(tableState);
  }

  async function fetchAllRows(
    tableState: TableState<Client_Dechet_Sld_Ini_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Client_Dechet_Sld_Ini_List(tableState);
  }
  
  return (
    <TitleCard title={ CLIENT_DECHET_SLD_INI_LIST_TITLE }>
      <GenericListPage<Client_Dechet_Sld_Ini_Type> {...props}
        tableName={ CLIENT_DECHET_SLD_INI_TABLE_NAME }
        title={ CLIENT_DECHET_SLD_INI_LIST_TITLE }
        columns={ client_Dechet_Sld_Ini_Columns }
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(client_Dechet_Sld_Ini: Client_Dechet_Sld_Ini_Type) => client_Dechet_Sld_Ini.id }
      />
    </TitleCard>
  )
};

export default Client_Dechet_Sld_Ini_List;