"use client";

import {
  retour_Dechet_Columns,
  RETOUR_DECHET_LIST_TITLE,
  RETOUR_DECHET_TABLE_NAME,
  Retour_Dechet_Type,
} from "@/types/retour-dechet";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import { useState } from "react";
import useAuth from "@/app/context/UseAuth";
import { VerifierMenu } from "@/components/ui/menu/Menus";
import Stored_Proc_Manager from "../sp/Stored_Proc_Manager";
import { fetch_All_Retour_Dechet_List, fetch_Retour_Dechet_List } from "@/fetch/retour-dechet";

const Retour_Dechet_List = (props: CmListProps<Retour_Dechet_Type>) => {

  const [spManagerOpen, setSpManagerOpen] = useState(false);
  
  async function fetchRows(
    tableState: TableState<Retour_Dechet_Type>
  ): Promise<NextResponse> {
    return await fetch_Retour_Dechet_List(tableState);
  }

  async function fetchAllRows(
    tableState: TableState<Retour_Dechet_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Retour_Dechet_List(tableState);
  }
  
  const handle_Verifier = async() => {
    setSpManagerOpen(true)
  }

  const VrfStoredProcs : string[] = [
    "dbo.VERIFIER_RETOUR_DECHET_MONTANT",
    "dbo.VERIFIER_RETOUR_DECHET_SANS_FILS",
    "dbo.VERIFIER_RETOUR_DECHET_LIGNE_MONTANT"
  ]

  const VrfStoredProcsRoles: string[] = VrfStoredProcs.map(p => `${p}.EXEC`);

  const { hasAnyRole } = useAuth();

  const optionsMenu : React.ReactNode[] = [
    (hasAnyRole(VrfStoredProcsRoles) && <VerifierMenu onClick={handle_Verifier} />)
  ]

  const handleClose = () => {
    setSpManagerOpen(false);
  };

  const Stored_Proc_Manager_Page = () => (
    <Stored_Proc_Manager
      spNames={VrfStoredProcs}
      open={spManagerOpen}    
      onClose={handleClose}
    />
  )

  return (
    <TitleCard title={ RETOUR_DECHET_LIST_TITLE }>
      <GenericListPage<Retour_Dechet_Type> {...props}
        tableName={ RETOUR_DECHET_TABLE_NAME }
        title={ RETOUR_DECHET_LIST_TITLE }
        columns={retour_Dechet_Columns}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(retour_Dechet: Retour_Dechet_Type) => retour_Dechet.numero }
        optionsMenu={optionsMenu}
      />
      <Stored_Proc_Manager_Page />
    </TitleCard>
  )
};

export default Retour_Dechet_List;