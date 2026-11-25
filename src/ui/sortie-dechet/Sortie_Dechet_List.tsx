"use client";

import {
  sortie_Dechet_Columns,
  SORTIE_DECHET_DEFAULT_SORT,
  SORTIE_DECHET_LIST_TITLE,
  SORTIE_DECHET_TABLE_NAME,
  Sortie_Dechet_Type,
} from "@/types/sortie-dechet";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, Filter, TableState } from "@/lib/types";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { MuiDatePicker } from "@/components/form-show/Inputs";
import { firstDayOfMonthOffset } from "@/lib/date-utils";
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

dayjs.extend(utc);

const Sortie_Dechet_List = (props: CmListProps<Sortie_Dechet_Type>) => {

  // Date pièce control above the list (not in pick-lists): starts at the 1st of last
  // month; its value is the list's initialFilter (">=": from that day on). Cleared = no date filter.
  const [datePiece, setDatePiece] = useState<Date | null>(() => firstDayOfMonthOffset(-1));
  const initialFilter: Filter<Sortie_Dechet_Type> | undefined = props.isModalList
    ? props.initialFilter
    : { date_piece: datePiece ? `>=${dayjs.utc(datePiece).format("DD/MM/YYYY")}` : "" };

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


  const handlePrint = async(data: Sortie_Dechet_Type[]) : Promise<void> => {
    await sortie_Dechet_List_Print(data, user?.id);
  };


  return (
    <TitleCard title={ SORTIE_DECHET_LIST_TITLE }>
      {!props.isModalList && (
        <Box sx={{ width: 250, pt: 1 }}>
          <MuiDatePicker
            name="date_piece_filter"
            label="Date pièce"
            mode="Edit"
            value={datePiece ? dayjs.utc(datePiece) : null}
            onChange={(d) => setDatePiece(d ? dayjs.utc(d).startOf("day").toDate() : null)}
            onClear={() => setDatePiece(null)}
          />
        </Box>
      )}
      <GenericListPage<Sortie_Dechet_Type> {...props}
        tableName={ SORTIE_DECHET_TABLE_NAME }
        title={ SORTIE_DECHET_LIST_TITLE }
        columns={sortie_Dechet_Columns}
        initialSort={SORTIE_DECHET_DEFAULT_SORT}
        initialFilter={initialFilter}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(sortie_Dechet: Sortie_Dechet_Type) => sortie_Dechet.numero }
        optionsMenu={optionsMenu}
        onPrint={handlePrint}
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

export default Sortie_Dechet_List;