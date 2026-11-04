"use client";

import {
  versement_Dechet_Columns,
  VERSEMENT_DECHET_LIST_TITLE,
  VERSEMENT_DECHET_TABLE_NAME,
  Versement_Dechet_Type,
} from "@/types/versement-dechet";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import { useState } from "react";
import useAuth from "@/app/context/UseAuth";
import { VerifierMenu } from "@/components/ui/menu/Menus";
import Stored_Proc_Manager from "../sp/Stored_Proc_Manager";
import { fetch_All_Versement_Dechet_List, fetch_Versement_Dechet_List } from "@/fetch/versement-dechet";

const Versement_Dechet_List = (props: CmListProps<Versement_Dechet_Type>) => {

  const [spManagerOpen, setSpManagerOpen] = useState(false);
  
  async function fetchRows(
    tableState: TableState<Versement_Dechet_Type>
  ): Promise<NextResponse> {
    return await fetch_Versement_Dechet_List(tableState);
  }

  async function fetchAllRows(
    tableState: TableState<Versement_Dechet_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Versement_Dechet_List(tableState);
  }
  
  const handle_Verifier = async() => {
    setSpManagerOpen(true)
  }

  const VrfStoredProcs : string[] = [
    "dbo.VERIFIER_VERSEMENT_DECHET_SANS_FILS"
  ]

  const VrfStoredProcsRoles: string[] = VrfStoredProcs.map(p => `${p}.EXEC`);

  const { hasAnyRole } = useAuth();

  const optionsMenu : React.ReactNode[] = [
    (hasAnyRole(VrfStoredProcsRoles) && <VerifierMenu onClick={handle_Verifier} />)
  ]

  const handleClose = () => {
    setSpManagerOpen(false);
  };


  return (
    <TitleCard title={ VERSEMENT_DECHET_LIST_TITLE }>
      <GenericListPage<Versement_Dechet_Type> {...props}
        tableName={ VERSEMENT_DECHET_TABLE_NAME }
        title={ VERSEMENT_DECHET_LIST_TITLE }
        columns={versement_Dechet_Columns}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(versement_Dechet: Versement_Dechet_Type) => versement_Dechet.numero }
        optionsMenu={optionsMenu}
      />
      <Stored_Proc_Manager
        spNames={VrfStoredProcs}
        open={spManagerOpen}
        onClose={handleClose}
      />
    </TitleCard>
  )
};

export default Versement_Dechet_List;