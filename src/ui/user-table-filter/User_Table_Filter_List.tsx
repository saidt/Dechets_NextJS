"use client";

import {
  USER_TABLE_FILTER_LIST_TITLE,
  USER_TABLE_FILTER_TABLE_NAME,
  User_Table_Filter_Type,
} from "@/types/user-table-filter";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, Column, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import { useSession } from "next-auth/react";
import { fetch_All_User_Table_Filter, fetch_User_Table_Filter } from "@/fetch/user-table-filter";

const User_Table_Filter_List = (props: CmListProps<User_Table_Filter_Type>) => {

  const { data: session } = useSession()
  const user = session?.user

  async function fetchRows(
    tableState: TableState<User_Table_Filter_Type>
  ): Promise<NextResponse> {
    return await fetch_User_Table_Filter(tableState, user?.id ?? '');
  }

  async function fetchAllRows(
    tableState: TableState<User_Table_Filter_Type>
  ): Promise<NextResponse> {
    return await fetch_All_User_Table_Filter(tableState, user?.id ?? '');
  }

  const id_column: Column<User_Table_Filter_Type> = {
    accessor: "id" as keyof User_Table_Filter_Type,
    header: "Id",
    width: 100,
  };
  const user_id_column: Column<User_Table_Filter_Type> = {
    accessor: "user_id" as keyof User_Table_Filter_Type,
    header: "User Id",
    width: 100,
  };
  const table_name_column: Column<User_Table_Filter_Type> = {
    accessor: "table_name" as keyof User_Table_Filter_Type,
    header: "Table",
    width: 250,
  };
  const filter_name_column: Column<User_Table_Filter_Type> = {
    accessor: "filter_name" as keyof User_Table_Filter_Type,
    header: "Nom filtre",
    width: 200,
  };
  const type_column: Column<User_Table_Filter_Type> = {
    accessor: "type" as keyof User_Table_Filter_Type,
    header: "Type",
    width: 100,
  };
  const filter_column: Column<User_Table_Filter_Type> = {
    accessor: "filter" as keyof User_Table_Filter_Type,
    header: "Filtre",
    width: 250,
  };

  const columns: Column<User_Table_Filter_Type>[] = [
    id_column,
    user_id_column,
    table_name_column,
    filter_name_column,
    type_column,
    filter_column,
  ];

  const referenceColumns: Column<User_Table_Filter_Type>[] = [
    id_column,
    filter_name_column,
    type_column,
    filter_column,
  ];

  return (
    <TitleCard title={USER_TABLE_FILTER_LIST_TITLE}>
      <GenericListPage<User_Table_Filter_Type> {...props}
        tableName={USER_TABLE_FILTER_TABLE_NAME}
        title={USER_TABLE_FILTER_LIST_TITLE}
        columns={props.isModalList ? referenceColumns : columns}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(item: User_Table_Filter_Type) => item.id}
        childUrl="table-filter"
      />
    </TitleCard>
  );
};

export default User_Table_Filter_List;