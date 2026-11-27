"use client";

import {
  pesee_Columns,
  PESEE_LIST_TITLE,
  PESEE_TABLE_NAME,
  Pesee_Type,
  PESEE_DEFAULT_SORT,
} from "@/types/pesee";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, Filter, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import { fetch_All_Pesee_List, fetch_Pesee_List } from "@/fetch/pesee";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { firstDayOfMonthOffset } from "@/lib/date-utils";
import { consoleWarn } from "@/lib/clientLog";

dayjs.extend(utc);

const Pesee_List = (props: CmListProps<Pesee_Type>) => {
  const initialFilter: Filter<Pesee_Type> = 
    props.initialFilter ?? { date_1: `>=${dayjs.utc(firstDayOfMonthOffset(-1)).format("DD/MM/YYYY")}` };

  consoleWarn("Pesee_List initialFilter", initialFilter);
      
  async function fetchRows(
    tableState: TableState<Pesee_Type>
  ): Promise<NextResponse> {
    return await fetch_Pesee_List(tableState);
  }

  async function fetchAllRows(
    tableState: TableState<Pesee_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Pesee_List(tableState);
  }
  
  return (
    <TitleCard title={ PESEE_LIST_TITLE }>
      <GenericListPage<Pesee_Type> {...props}
        tableName={ PESEE_TABLE_NAME }
        title={ PESEE_LIST_TITLE }
        columns={ pesee_Columns }
        initialSort={PESEE_DEFAULT_SORT}
        initialFilter={initialFilter}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(pesee: Pesee_Type) => pesee.numero_1 }
      />
    </TitleCard>
  )
};

export default Pesee_List;