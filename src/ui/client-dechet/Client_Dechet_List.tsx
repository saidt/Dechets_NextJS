"use client";

import {
  client_Dechet_Columns,
  CLIENT_DECHET_LIST_TITLE,
  CLIENT_DECHET_TABLE_NAME,
  Client_Dechet_Type,
} from "@/types/client-dechet";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import useAuth from "@/app/context/UseAuth";
import { StatistiqueMenu, VerifierMenu } from "@/components/ui/menu/Menus";
import { useEffect, useState } from "react";
import Stored_Proc_Manager from "../sp/Stored_Proc_Manager";
import { Stored_Proc_Param_Type } from "@/types/sp";
import { formatDateTime } from "@/lib/date-utils";
import PeriodeDialog from "@/components/ui/dialog/PeriodeDialog";
import Stored_Proc_List from "../sp/Stored_Proc_List";
import { fetch_All_Client_Dechet_List, fetch_Client_Dechet_List } from "@/fetch/client-dechet";
import { useAppContext } from "@/app/context/AppContext";
import { fetchPeriode, PeriodeResultType } from "@/lib/periode";
import { handleError } from "@/lib/error";

const Client_Dechet_List = (props: CmListProps<Client_Dechet_Type>) => {
  const [spManagerOpen, setSpManagerOpen] = useState(false);

  const [dateDeb, setDateDeb] = useState<Date | null>(new Date());
  const [dateFin, setDateFin] = useState<Date | null>(new Date());
  const [spName, setSpName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [params, setParams] = useState<Stored_Proc_Param_Type[]>([]);
  
  const [periodeOpen, setPeriodeOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { addNotification } = useAppContext();
  
  const { hasRole, hasAnyRole } = useAuth();

  async function fetchRows(
    tableState: TableState<Client_Dechet_Type>
  ): Promise<NextResponse> {
    return await fetch_Client_Dechet_List(tableState);
  }

  async function fetchAllRows(
    tableState: TableState<Client_Dechet_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Client_Dechet_List(tableState);
  }
  
  const handle_Verifier = async() => {
    setSpManagerOpen(true)
  }

  const VrfStoredProcs : string[] = [
    "dbo.VERIFIER_CLIENT_DECHET_ACOMPTE",
    "dbo.VERIFIER_CLIENT_DECHET_SOLDE_DECHET"
  ]
  
  const VrfStoredProcsRoles: string[] = VrfStoredProcs.map(p => `${p}.EXEC`);

  const handle_Stats_Resume = async() => {
    setSpName("dbo.STAT_SORTIE_DECHET_TOUS_RESUME")
    setPeriodeOpen(true)
  }

  const handle_Stats_Detail = async() => {
    setSpName("dbo.STAT_SORTIE_DECHET_TOUS_DETAIL")
    setPeriodeOpen(true)
  }

  const optionsMenu : React.ReactNode[] = [
    (hasAnyRole(VrfStoredProcsRoles) && <VerifierMenu onClick={handle_Verifier} />),
    (hasRole("dbo.STAT_SORTIE_DECHET_TOUS_RESUME.EXEC") && 
      <StatistiqueMenu caption="Statistiques des sorties déchets (résumé)" onClick={handle_Stats_Resume} />),
    (hasRole("dbo.STAT_SORTIE_DECHET_TOUS_DETAIL.EXEC") && 
      <StatistiqueMenu caption="Statistiques des sorties déchets (détail)" onClick={handle_Stats_Detail} />)
  ]

  const handleClose = () => {
    setSpManagerOpen(false);
  };


  const handle_Execute_Periode = () => {
    if (spName === "dbo.STAT_SORTIE_DECHET_TOUS_RESUME") {
      setTitle(
        `Statistiques des sorties déchets de tous les clients (résumé)
        du ${dateDeb ? formatDateTime(dateDeb) : ''}
        au ${dateFin ? formatDateTime(dateFin) : ''}`
      )
      setParams([
        {name: "DateDeb", value: dateDeb},
        {name: "DateFin", value: dateFin}
      ])
    }
    else if (spName === "dbo.STAT_SORTIE_DECHET_TOUS_DETAIL") {
      setTitle(
        `Statistiques des sorties déchets de tous les clients (détail)
        du ${dateDeb ? formatDateTime(dateDeb) : ''}
        au ${dateFin ? formatDateTime(dateFin) : ''}`
      )
      setParams([
        {name: "DateDeb", value: dateDeb},
        {name: "DateFin", value: dateFin}
      ])
    }
    setStatsOpen(true)
  };

  const handleClosePeriode = () => {
    setPeriodeOpen(false);
  };

  const handleCloseStats = () => {
    setStatsOpen(false);
  };

  useEffect(() => {
    async function fetch_Periode() {
      setLoading(true);
      try {
        const result : PeriodeResultType = await fetchPeriode();
        if (result.error) {
          addNotification(result.error, "error");
        }
        else {
          setDateDeb(result.dateDeb);
          setDateFin(result.dateFin);
        }
      }
      catch (err) {
        handleError("Client_Dechet_List fetch_Periode failed", err, addNotification);
      }
      finally {
        setLoading(false);
      }
    }
    fetch_Periode();
  }, []);



  return (
    <TitleCard title={ CLIENT_DECHET_LIST_TITLE }>
      <GenericListPage<Client_Dechet_Type> {...props}
        tableName={ CLIENT_DECHET_TABLE_NAME }
        title={ CLIENT_DECHET_LIST_TITLE }
        columns={client_Dechet_Columns}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        loading={loading}
        getId={(client_Dechet: Client_Dechet_Type) => client_Dechet.code }
        optionsMenu={optionsMenu}
      />
      <Stored_Proc_Manager
        spNames={VrfStoredProcs}
        open={spManagerOpen}
        onClose={handleClose}
      />
      <PeriodeDialog
        open={periodeOpen}
        onClose={handleClosePeriode}
        dateDeb={dateDeb}
        dateFin={dateFin}
        setDateDeb={setDateDeb}
        setDateFin={setDateFin}
        onExecuteClick={handle_Execute_Periode}
      />
      <Stored_Proc_List
        spName={spName}
        open={statsOpen}
        onClose={handleCloseStats}
        title={title}
        params={params}
      />
    </TitleCard>
  )
};

export default Client_Dechet_List;