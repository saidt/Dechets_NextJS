"use client";

import { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Column, Filter, TableState } from "@/lib/types";
import { useAppContext } from "@/app/context/AppContext";
import { ReactMemTable } from "./ReactMemTable";
import ToolbarMemList from "./ToolBarMemList";
import { applyFilter } from "@/lib/localData";
import { ReportLayout, ReportList } from "../pdf/ReportComponent";
import { downloadPdf } from "../pdf/pdfService";
import { useRouter } from "next/navigation";
import { clientError, handleError } from "@/lib/error";
import { useSession } from "next-auth/react";
import Loading from "../ui/Loading";
import { exportToExcel } from "@/lib/excel";
import useAuth from "@/app/context/UseAuth";
import { consoleError } from "@/lib/clientLog";

export interface GenericMemListPageProps<T extends Record<string, any>> {
  title: string;
  columns: Column<T>[];
  isModalList : boolean;
  permanentFilter? : Filter<T>;
  initialPageSize?: number;
  loading?: boolean;
  allData?: T[];
  optionsMenu?: React.ReactNode[];
  fetchAllData?: () => Promise<T[]>;
  //getId: (item: T) => string | number;
  renderRowActions?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  onPrint?: (data: T[]) => Promise<void>;
}

export function GenericMemListPage<T extends Record<string, any>>({
  title,
  columns,
  isModalList,
  permanentFilter,
  initialPageSize,
  loading,
  allData,
  optionsMenu,
  fetchAllData,
  //getId,
  renderRowActions,
  onRowClick,
  onPrint
}: GenericMemListPageProps<T>) {

  const [localAllData, setLocalAllData] = useState<T[]>([]);
  const [localLoading, setLocalLoading] = useState(false);

  function createInitialTableState<T extends Record<string, any>>(
    columns: Column<T>[],
    initialPageSize?: number
  ): TableState<T> {
    const initialFilter = columns.reduce(
      (acc, col) => ({ ...acc, [col.accessor]: "" }),
      {} as Filter<T>
    );

    return {
      page: 0,
      pageSize: initialPageSize ?? 8,
      sort: null,
      filter: initialFilter,
      quickSearch: "",
    };
  }

  const [tableState, setTableState] = useState<TableState<T>>(() =>
    createInitialTableState(columns, initialPageSize)
  );

  const { data: session, status } = useSession()
  const { addNotification } = useAppContext();
  const { authLoading } = useAuth();
  const router =  useRouter()
  const { getCurrentUrl } = useAppContext();
  const curUrl = getCurrentUrl()

  const user = session?.user

   useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("GenericMemListPage: session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]);

  useEffect(() => {
    if (status !== "loading" && !authLoading && (!user || !user.id)) {
      clientError("GenericMemListPage: no user data!", null, curUrl, router);
    }
  }, [user, status, authLoading, curUrl, router]);

  useEffect(() => {
    if (!fetchAllData && !allData) {
    clientError('GenericMemListPage: please give either fetchAllData or allData !', null, curUrl, router)
    return
  }
  }, [fetchAllData, allData, curUrl, router]);

  const handleExportXls = async () => {
    try {
      if (localAllData.length === 0) {
        addNotification("Aucune donnée à exporter", "warning");
        return;
      }

      exportToExcel(title, columns, localAllData)
    } 
    catch (err: any) {
      handleError('Export Xlsx', err, addNotification)
    }
  };

  const handleDefaultPrint = async () => {
    try {
      if (localAllData.length === 0) {
        addNotification('Aucune donnée à imprimer !', 'info');
        return;
      }

      if (onPrint) {
        await onPrint(localAllData);
        return;
      }

      const doc = (
        <ReportLayout title={title} userId={user?.id}>
          <ReportList columns={columns} data={localAllData} />
        </ReportLayout>
      );

      await downloadPdf(doc, `${title}.pdf`);
    } 
    catch (err: any) {
      consoleError(`Failed to print ${title}`, { error: String(err) });
      addNotification(err instanceof Error ? err.message : String(err), "error");
    }
  };

  const fetchAllDataCallback = useCallback(async () => {
    if (fetchAllData) {
      //consoleInfo('GenericMemListPage fetchAllDataCallback')
      setLocalLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 100)); // ???
        const data = await fetchAllData();
        //consoleInfo('GenericMemListPage fetchAllDataCallback data: ', data)
        if (permanentFilter) {
          const filteredData = applyFilter(data, permanentFilter, "")
          setLocalAllData(filteredData);
        }
        else {
          setLocalAllData(data);
        }
      }
      catch (err: any) {
        consoleError("GenericMemListPage fetchAllDataCallback api error: ", err);
        setLocalAllData([]);
        handleError('fetchAllDataCallback api error', err, addNotification)
      }
      finally {
        setLocalLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    setTableState(createInitialTableState(columns, initialPageSize))
  }, [fetchAllData, allData]);
  
  const handleResfresh = async () => {
    if (allData === undefined) {
      await fetchAllDataCallback()
    }
  };

  useEffect(() => {
    if (allData === undefined) {
      fetchAllDataCallback();
    }
    else {
      setLocalAllData(allData)
    }
  }, [allData, fetchAllDataCallback]);

  if (status === "loading" || authLoading) return <Loading />;
  if (!session || !user) return null;

  return (
    <Box>
      <ToolbarMemList
        quickSearch={tableState.quickSearch}
        onQuickSearchChange={(value) => setTableState((prev) => ({
          ...prev,
          quickSearch: value,
          page: 0,
        }))}
        onRefresh={handleResfresh}
        onExport={handleExportXls}
        onPrint={handleDefaultPrint}
        isModalList={isModalList}
        optionsMenu={optionsMenu}
      />
      <ReactMemTable<T>
        columns={columns}
        allData={localAllData}
        tableState={tableState}
        loading={localLoading || (loading ?? false)}
        onTableStateChange={setTableState}
        renderRowActions={renderRowActions}
        onRowClick={onRowClick}
      />
    </Box>
  );
}