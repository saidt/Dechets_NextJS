"use client";

import {
  DialogProps,
} from "@mui/material";
import { User_Table_Filter_Type } from "@/types/user-table-filter";
import User_Table_Filter_List from "@/ui/user-table-filter/User_Table_Filter_List";
import { Filter } from "@/lib/types";
import { useRouter } from "next/navigation";
import { clientError } from "@/lib/error";
import { useSession } from "next-auth/react";
import Loading from "../Loading";
import useAuth from "@/app/context/UseAuth";
import { useEffect } from "react";
import MuiDialog from "./MuiDialog";
import { useAppContext } from "@/app/context/AppContext";

export interface FilterLoadDialogProps<T extends Record<string, any>>  extends DialogProps {
  tableName: string;
  onLoadFilter: (filter: Filter<T>) => void;
}

export default function UserTableFilterLoadDialog<T extends Record<string, any>>(props: FilterLoadDialogProps<T>) {
  
  const { data: session, status } = useSession();
  const { authLoading } = useAuth();
  const user = session?.user
  const router = useRouter();
  const { getCurrentUrl } = useAppContext();
    const curUrl = getCurrentUrl()

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("UserTableFilterLoadDialog: session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]);

  useEffect(() => {
    if (status !== "loading" && !authLoading && (!user || !user.id)) {
      clientError("UserTableFilterLoadDialog: no user data!", null, curUrl, router);
    }
  }, [user, status, authLoading, curUrl, router]);

  const handleClose = () => {
    props.onClose ? props.onClose({}, "backdropClick") : null;
  };

  const { onLoadFilter } = props;

  const handleRowClick = (item: User_Table_Filter_Type) => {
    const filter = JSON.parse(item.filter);
    //consoleInfo("UserTableFilterLoadDialog handleRowClick filter : ", filter);
    handleClose();
    onLoadFilter(filter);
  };

  const permanentFilter: Filter<User_Table_Filter_Type> = {
    user_id: { value: user?.id ?? '', exactFilter: true },
    table_name: { value: props.tableName, exactFilter: true },
  };

  if (status === "loading" || authLoading) return <Loading />;
  if (!session || !user) return null;

  return (
    <MuiDialog {...props}
      title=""
      children={
        <User_Table_Filter_List
          isModalList={true}
          permanentFilter={permanentFilter}
          onRowClick={handleRowClick}
        />
      }
      maxWidth={"md"}
    />
  );
}