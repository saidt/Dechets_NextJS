"use client";

import {
  reglement_Dechet_Columns,
  REGLEMENT_DECHET_LIST_TITLE,
  REGLEMENT_DECHET_TABLE_NAME,
  Reglement_Dechet_Type,
} from "@/types/reglement-dechet";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import { useState } from "react";
import useAuth from "@/app/context/UseAuth";
import { StatistiqueMenu, VerifierMenu } from "@/components/ui/menu/Menus";
import Stored_Proc_Manager from "../sp/Stored_Proc_Manager";
import { fetch_All_Reglement_Dechet_List, fetch_Reglement_Dechet_List } from "@/fetch/reglement-dechet";
import { Stored_Proc_Param_Type } from "@/types/sp";
import Stored_Proc_List from "../sp/Stored_Proc_List";

const Reglement_Dechet_List = (props: CmListProps<Reglement_Dechet_Type>) => {

  const [spManagerOpen, setSpManagerOpen] = useState(false);
  const [spName, setSpName] = useState<string>('');
  const [statsOpen, setStatsOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [params, setParams] = useState<Stored_Proc_Param_Type[]>([]);
  
  async function fetchRows(
    tableState: TableState<Reglement_Dechet_Type>
  ): Promise<NextResponse> {
    return await fetch_Reglement_Dechet_List(tableState);
  }

  async function fetchAllRows(
    tableState: TableState<Reglement_Dechet_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Reglement_Dechet_List(tableState);
  }
  
  const handle_Verifier = async() => {
    setSpManagerOpen(true)
  }

  const VrfStoredProcs : string[] = [
    "dbo.VERIFIER_REGLEMENT_DECHET_MONTANT_REGLE",
    "dbo.VERIFIER_REGLEMENT_DECHET_MONTANT_VERSE",
    "dbo.VERIFIER_REGLEMENT_DECHET_SANS_FILS"
  ]

  const VrfStoredProcsRoles: string[] = VrfStoredProcs.map(p => `${p}.EXEC`);

  const { hasRole, hasAnyRole } = useAuth();
  const optionsMenu : React.ReactNode[] = [
    (hasRole("dbo.REGLEMENT_DECHET_RESTE_A_VERSER.EXEC") && 
      <StatistiqueMenu caption="Réglements déchets restant à verser"
        onClick={() => { 
          setSpName("dbo.REGLEMENT_DECHET_RESTE_A_VERSER"),
          setTitle('Réglements déchets restant à verser')
          setParams([])
          setStatsOpen(true)
        }}
      />),
      (hasAnyRole(VrfStoredProcsRoles) && <VerifierMenu onClick={handle_Verifier} />)
  ]

  const handleClose = () => {
    setSpManagerOpen(false);
  };



  return (
    <TitleCard title={ REGLEMENT_DECHET_LIST_TITLE }>
      <GenericListPage<Reglement_Dechet_Type> {...props}
        tableName={ REGLEMENT_DECHET_TABLE_NAME }
        title={ REGLEMENT_DECHET_LIST_TITLE }
        columns={reglement_Dechet_Columns}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(reglement_Dechet: Reglement_Dechet_Type) => reglement_Dechet.numero }
        optionsMenu={optionsMenu}
      />
      <Stored_Proc_Manager
        spNames={VrfStoredProcs}
        open={spManagerOpen}
        onClose={handleClose}
      />
      <Stored_Proc_List
        spName={spName}
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        title={title}
        params={params}
      />
    </TitleCard>
  )
};

export default Reglement_Dechet_List;