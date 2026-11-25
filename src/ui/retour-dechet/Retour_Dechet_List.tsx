"use client";

import {
  retour_Dechet_Columns,
  RETOUR_DECHET_LIST_TITLE,
  RETOUR_DECHET_TABLE_NAME,
  Retour_Dechet_Type,
  RETOUR_DECHET_DEFAULT_SORT,
} from "@/types/retour-dechet";
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
import { VerifierMenu } from "@/components/ui/menu/Menus";
import Stored_Proc_Manager from "../sp/Stored_Proc_Manager";
import { fetch_All_Retour_Dechet_List, fetch_Retour_Dechet_List } from "@/fetch/retour-dechet";

dayjs.extend(utc);

const Retour_Dechet_List = (props: CmListProps<Retour_Dechet_Type>) => {

  // Date pièce control above the list (not in pick-lists): starts at the 1st of last
  // month; its value is the list's initialFilter. Cleared = no date filter.
  const [datePiece, setDatePiece] = useState<Date | null>(() => firstDayOfMonthOffset(-1));
  const initialFilter: Filter<Retour_Dechet_Type> | undefined = props.isModalList
    ? props.initialFilter
    : { date_piece: datePiece ? dayjs.utc(datePiece).format("DD/MM/YYYY") : "" };

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


  return (
    <TitleCard title={ RETOUR_DECHET_LIST_TITLE }>
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
      <GenericListPage<Retour_Dechet_Type> {...props}
        tableName={ RETOUR_DECHET_TABLE_NAME }
        title={ RETOUR_DECHET_LIST_TITLE }
        columns={retour_Dechet_Columns}
        initialSort={RETOUR_DECHET_DEFAULT_SORT}
        initialFilter={initialFilter}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(retour_Dechet: Retour_Dechet_Type) => retour_Dechet.numero }
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

export default Retour_Dechet_List;