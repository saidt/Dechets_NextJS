"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { GenericMemListPage } from "@/components/datatable/GenericMemListPage";
import MuiDialog from "@/components/ui/dialog/MuiDialog";
import Loading from "@/components/ui/Loading";
import { CorrigerMenu } from "@/components/ui/menu/Menus";

import { Column } from "@/lib/types";
import { fetchStoredProc, storedProcParams } from "@/lib/fetchData";
import { clientError, handleError } from "@/lib/error";

import { useAppContext } from "@/app/context/AppContext";
import useAuth from "@/app/context/UseAuth";

import { Stored_Proc_Param_Meta_Type, Stored_Proc_Param_Type } from "@/types/sp";
import { DialogProps, ModalProps } from "@mui/material";
import { consoleInfo } from "@/lib/clientLog";

export interface SplMemListPageProps extends DialogProps{
  spName: string;
  open: boolean;
  progress?: { current: number; total: number };
  params?: Stored_Proc_Param_Type[];
  onClose: ModalProps["onClose"];
}

const Stored_Proc_List = ({ spName, open, progress, params, onClose, ...restProps }: SplMemListPageProps) => {
  // ✅ STATE
  const [columns, setColumns] = useState<Column<Record<string, any>>[]>([]);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [localParams, setLocalParams] = useState<Stored_Proc_Param_Type[] | null>(params ? params : null);
  const [loading, setLoading] = useState(false);
  const [optionsMenu, setOptionsMenu] = useState<React.ReactNode[]>([]);

  // ✅ CONTEXT / HOOKS
  const { data: session, status } = useSession();
  const { hasRole, authLoading } = useAuth();
  const { addNotification } = useAppContext();
  const router = useRouter();

  const { getCurrentUrl } = useAppContext();
  const curUrl = getCurrentUrl()

  // ✅ DERIVED STATE
  const user = session?.user;
  const role = useMemo(() => `${spName}.EXEC`, [spName]);
  const authorized = useMemo(() => hasRole(role), [hasRole, role]);

  // ✅ SIDE EFFECTS (ERROR HANDLING)

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("Session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]);

  useEffect(() => {
    if (status !== "loading" && !authLoading && (!user || !user.id)) {
      clientError("Stored_Proc_List: no user data!", null, curUrl, router);
    }
  }, [user, status, authLoading, curUrl, router]);

  useEffect(() => {
    if (status !== "loading" && !authLoading && open && !authorized) {
      clientError(
        `${spName}: vous n'avez pas le droit d'exécuter cette procédure stockée !`,
        null,
        curUrl || "/",
        router
      );
    }
  }, [authorized, status, authLoading, open, spName, curUrl, router]);

  // ✅ HELPERS

  const deriveColumns = useCallback(
    <T extends Record<string, any>>(firstRow: T): Column<T>[] =>
      Object.keys(firstRow).map((key) => ({
        accessor: key as keyof T,
        header: key,
        width: 100,
      })),
    []
  );

  // ✅ DATA FETCHING

  const fetchParams = async () => {
    setLoading(true);
    try {
      const response = await storedProcParams(spName);
      const result = await response.json();

      if (result.error) {
        addNotification(result.error, "error");
        setLocalParams([]);
      }
      else {
        const data = result.data;

        const newParams = data.map((p: Stored_Proc_Param_Meta_Type) => ({
          name: p.name.startsWith('@') ? p.name.slice(1) : p.name,
          value: null
        }));

        setLocalParams(newParams)
        consoleInfo('Stored_Proc_List fetchParams params : ', localParams);
      }
    } catch (err) {
      handleError("fetchParams failed", err, addNotification);
    } finally {
      setLoading(false);
    }
  }

  const fetchAllData = async () => {
    if (!localParams) return;

    setLoading(true);
    try {
      const response = await fetchStoredProc(spName, localParams);
      const result = await response.json();

      if (result.error) {
        addNotification(result.error, "error");
        setRows([]);
      }
      else {
        const data = result.data;

        setRows(data);
        if (data.length > 0) {
          setColumns(deriveColumns(data[0]));
        }
      }
    } catch (err) {
      handleError("fetchAllData failed", err, addNotification);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLocalParams(null)
  }, [spName]);

  useEffect(() => {
    const loadParams = async () => {
      if (!localParams && open) {
        await fetchParams();
      };
    }
    loadParams();
  }, [localParams, open]);

  useEffect(() => {
    const setParams = () => {
      if (params && localParams && open) {
        params.forEach(param => {
          const local = localParams.find(lp => lp.name === param.name);
          if (local) {
            local.value = param.value;
          }
        });
      }
    }
    setParams();
  }, [params, localParams, open]);

  useEffect(() => {
    const loadData = async () => {
      if (localParams && open) {
        await fetchAllData();
      }
    };
    loadData();
  }, [localParams, open]);

  useEffect(() => {
    if (localParams?.some((p) => p.name === "MAJ")) {
      setOptionsMenu([<CorrigerMenu key="corriger" onClick={handleCorriger} />]);
    }
    else {
      setOptionsMenu([]);
    }
  }, [localParams]);

  // ✅ ACTIONS

  const handleCorriger = useCallback(async () => {
    setLocalParams([{ name: "MAJ", value: "O" }]);
    await fetchAllData();
    setLocalParams([{ name: "MAJ", value: "N" }]);
  }, [fetchAllData]);

  // ✅ RENDER GUARDS (SAFE NOW)

  if (open && (status === "loading" || authLoading)) return <Loading />;
  if (!session || !user) return null;
  if (!authorized) return null;

  // ✅ UI

  const progressTitle = progress ?  `(${progress.current}/${progress.total})` : ''
  const title = restProps.title ? restProps.title : `${spName} ${progressTitle}`

  return (
    <MuiDialog
      title={title}
      open={open}
      onClose={onClose}
    >
      <GenericMemListPage<Record<string, any>>
        title={spName}
        columns={columns}
        isModalList={false}
        allData={rows}
        loading={loading}
        optionsMenu={optionsMenu}
      />
    </MuiDialog>
  );
};

export default Stored_Proc_List;