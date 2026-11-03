"use client";

import {
  unite_Conversion_Columns,
  UNITE_CONVERSION_LIST_TITLE,
  UNITE_CONVERSION_TABLE_NAME,
  Unite_Conversion_Type,
} from "@/types/unite-conversion";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import { ListItemIcon, MenuItem, MenuItemProps } from "@mui/material";
import Unite_Conversion_Dialog from "./Unite_Conversion_Dialog";
import { useState } from "react";
import { fetch_All_Unite_Conversion_List, fetch_Unite_Conversion_List } from "@/fetch/unite-conversion";

const Unite_Conversion_List = (props: CmListProps<Unite_Conversion_Type>) => {

  const [dialogOpen, setDialogOpen] = useState(false);

  async function fetchRows(
    tableState: TableState<Unite_Conversion_Type>
  ): Promise<NextResponse> {
    return await fetch_Unite_Conversion_List(tableState);
  }

  async function fetchAllRows(
    tableState: TableState<Unite_Conversion_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Unite_Conversion_List(tableState);
  }
  
  const ConvertMenu = (props : MenuItemProps) => {
    return (
      <MenuItem {...props}>
        <ListItemIcon>
          <MultipleStopIcon color="secondary"/>
        </ListItemIcon>
        Conversion d'unités
      </MenuItem>    
    );
  };

  const optionsMenu : React.ReactNode[] = [
    <ConvertMenu onClick={() => setDialogOpen(true)} />
  ]

  const Unite_Conversion_Dialog_Page = () => (
    <Unite_Conversion_Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
    />
  )

  return (
    <TitleCard title={ UNITE_CONVERSION_LIST_TITLE }>
      <GenericListPage<Unite_Conversion_Type> {...props}
        tableName={ UNITE_CONVERSION_TABLE_NAME }
        title={ UNITE_CONVERSION_LIST_TITLE }
        columns={unite_Conversion_Columns}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(unite_Conversion: Unite_Conversion_Type) => unite_Conversion.id }
        optionsMenu={optionsMenu}
      />
      <Unite_Conversion_Dialog_Page />
    </TitleCard>
  )
};

export default Unite_Conversion_List;