"use client";

import {
  sortie_Dechet_Columns,
  SORTIE_DECHET_LIST_TITLE,
  SORTIE_DECHET_TABLE_NAME,
  Sortie_Dechet_Type,
} from "@/types/sortie-dechet";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import { useState } from "react";
import useAuth from "@/app/context/UseAuth";
import { StatistiqueMenu, VerifierMenu } from "@/components/ui/menu/Menus";
import Stored_Proc_Manager from "../sp/Stored_Proc_Manager";
import { sortie_Dechet_List_Print } from "./Sortie_Dechet_List_Print";
import { useSession } from "next-auth/react";
import { fetch_All_Sortie_Dechet_List, fetch_Sortie_Dechet_List } from "@/fetch/sortie-dechet";
import Stored_Proc_List from "../sp/Stored_Proc_List";
import { Stored_Proc_Param_Type } from "@/types/sp";

const Sortie_Dechet_List = (props: CmListProps<Sortie_Dechet_Type>) => {

  const { data: session } = useSession()
  const user = session?.user

  const [spManagerOpen, setSpManagerOpen] = useState(false);
  const [spName, setSpName] = useState<string>('');
  const [statsOpen, setStatsOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [params, setParams] = useState<Stored_Proc_Param_Type[]>([]);

  async function fetchRows(
    tableState: TableState<Sortie_Dechet_Type>
  ): Promise<NextResponse> {
    return await fetch_Sortie_Dechet_List(tableState);
  }

  async function fetchAllRows(
    tableState: TableState<Sortie_Dechet_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Sortie_Dechet_List(tableState);
  }

  const handle_Verifier = async() => {
    setSpManagerOpen(true)
  }

  const VrfStoredProcs : string[] = [
    "dbo.VERIFIER_SORTIE_DECHET_MONTANT",
    "dbo.VERIFIER_SORTIE_DECHET_MONTANT_REGLE",
    "dbo.VERIFIER_SORTIE_DECHET_SANS_FILS",    
    "dbo.VERIFIER_SORTIE_DECHET_LIGNE_MONTANT"
  ]

  const VrfStoredProcsRoles: string[] = VrfStoredProcs.map(p => `${p}.EXEC`);

  const { hasRole, hasAnyRole } = useAuth();

  const optionsMenu : React.ReactNode[] = [
    (hasRole("dbo.SORTIE_DECHET_RESTE_A_PAYER.EXEC") && 
      <StatistiqueMenu caption="Sorties déchets restant à payer"
        onClick={() => { 
          setSpName("dbo.SORTIE_DECHET_RESTE_A_PAYER"),
          setTitle('Sorties déchets restant à payer')
          setParams([])
          setStatsOpen(true)
        }}
      />),
    (hasAnyRole(VrfStoredProcsRoles) && <VerifierMenu onClick={handle_Verifier} />),
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

  const handlePrint = async(data: Sortie_Dechet_Type[]) : Promise<void> => {
    await sortie_Dechet_List_Print(data, user?.id);
  };

  const Stats_Page = () => (
    <Stored_Proc_List
      spName={spName}
      open={statsOpen}
      onClose={() => setStatsOpen(false)}
      title={title}
      params={params}
    />
  )

  return (
    <TitleCard title={ SORTIE_DECHET_LIST_TITLE }>
      <GenericListPage<Sortie_Dechet_Type> {...props}
        tableName={ SORTIE_DECHET_TABLE_NAME }
        title={ SORTIE_DECHET_LIST_TITLE }
        columns={sortie_Dechet_Columns}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(sortie_Dechet: Sortie_Dechet_Type) => sortie_Dechet.numero }
        optionsMenu={optionsMenu}
        onPrint={handlePrint}
      />
      <Stored_Proc_Manager_Page />
      <Stats_Page />
    </TitleCard>
  )
};

export default Sortie_Dechet_List;