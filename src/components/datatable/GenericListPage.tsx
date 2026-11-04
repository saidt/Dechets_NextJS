"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { Box, IconButton } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { Column, Filter, TableState } from "@/lib/types";
import ToolbarList from "./ToolBarList";
import { useAppContext } from "@/app/context/AppContext";
import { loadLastViewedId, loadTableState, saveTableState } from "@/services/userSettingsService";
import { ReactTable } from "./ReactTable";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getResponseData } from "@/lib/html";
import { USER_TABLE_FILTER_CHILD_URL } from "@/types/user-table-filter";
import { addTableStateFilter } from "@/lib/lib";
import useAuth from "@/app/context/UseAuth";
import { ReportLayout, ReportList } from "../pdf/ReportComponent";
import { downloadPdf } from "@/components/pdf/pdfService";
import { clientError, handleError } from "@/lib/error";
import { NextResponse } from "next/server";
import { exportToExcel } from "@/lib/excel";
import { useSession } from "next-auth/react";
import Loading from "../ui/Loading";
import { USER_FETCH_URL } from "@/types/user";
import { consoleError } from "@/lib/clientLog";

export interface GenericListPageProps<T extends Record<string, any>> {
  tableName: string;
  title: string;
  columns: Column<T>[];
  isModalList : boolean;
  initialFilter?: Filter<T>;
  permanentFilter? : Filter<T>;
  initialPageSize?: number;
  loading?: boolean;
  childUrl?: string;
  optionsMenu?: React.ReactNode[];
  fetchData: (state: TableState<T>) => Promise<NextResponse>;
  fetchAllData: (state: TableState<T>) => Promise<NextResponse>;
  getId: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  onPrint?: (data: T[]) => Promise<void>;
}

export function GenericListPage<T extends Record<string, any>>({
  tableName,
  title,
  columns,
  isModalList,
  initialFilter,
  permanentFilter,
  initialPageSize,
  loading,
  childUrl,
  optionsMenu,
  fetchData,
  fetchAllData,
  getId,
  onRowClick,
  onPrint,
}: GenericListPageProps<T>) {

  const [lastViewedId, setLastViewedId] = useState<string | number | null>(null);
  const [data, setData] = useState<T[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);

  const { data: session, status } = useSession()
  const { addNotification, getCurrentUrl } = useAppContext();
  const { hasRole, authLoading } = useAuth();
  const router =  useRouter()
  const curUrl = getCurrentUrl()
  const pathname = usePathname();

  const user = session?.user
  const role = useMemo(() => `${tableName}.LIST`, [tableName]);
  const authorized = useMemo(() => hasRole(role), [hasRole, role]);

  const [tableState, setTableState] = useState<TableState<T>>(() => {
    const initialTableState : TableState<T> = {
      page: 0,
      pageSize: initialPageSize ?? 8,
      sort: null,
      filter: {},
      quickSearch: "",
    };

    if (initialFilter) {
      //consoleInfo("GenericListPage initialFilter: ", initialFilter);
      initialTableState.filter = initialFilter 
      return initialTableState;
    }

    if (user) {
      const savedState = loadTableState<T>(user.id, tableName);
      if (savedState) return savedState;
    }

    const emptyFilter = columns.reduce(
      (acc, col) => ({ ...acc, [col.accessor]: "" }),
      {} as Filter<T>
    );

    //consoleInfo("GenericListPage emptyFilter: ", emptyFilter);

    return {
      page: 0,
      pageSize: initialPageSize ?? 8,
      sort: null,
      filter: emptyFilter,
      quickSearch: "",
    };
  });

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("GenericListPage: session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]);

  useEffect(() => {
    if (status !== "loading" && !authLoading && (!user || !user.id)) {
      clientError("GenericListPage: no user data!", null, curUrl, router);
    }
  }, [user, status, authLoading, curUrl, router]);

  useEffect(() => {
    if (status !== "loading" && !authLoading && !authorized) {
      clientError(
        `${tableName}: vous n'avez pas le droit de consulter cette page !`,
        null,
        curUrl || "/",
        router
      );
    }
  }, [authorized, status, authLoading, tableName, curUrl, router]);

  const handleSaveContext = () => {
    if (user) {
      saveTableState(user.id, tableName, tableState);
      addNotification("Contexte sauvegardé", "success");
    }
  };

  const handleReadContext = () => {
    if (user) {
      const savedState = loadTableState<T>(user.id, tableName);
      if (savedState) {
        setTableState(savedState);
        addNotification("Contexte chargé", "success");
      }
      else {
        addNotification("Aucun contexte sauvegardé", "warning");
      }
    }
  };

  const handleLoadFilter = (filter: Filter<T>) => {
    //consoleInfo('GenericListPage handleLoadFilter filter: ', filter)
    //consoleInfo('GenericListPage handleLoadFilter tableState.filter: ', tableState.filter)
    const newTableState: TableState<T> = {
      page: 0,
      pageSize: tableState.pageSize,
      sort: tableState.sort,
      filter: filter,
      quickSearch: tableState.quickSearch
    }
    //consoleInfo('GenericListPage handleLoadFilter newTableState.filter: ', newTableState.filter)
    try {
      setTableState(newTableState)
      addNotification("Filtre chargé", "success");
    } 
    catch (err: any) {
      handleError('Load filter for', err, addNotification)
    }
  };

  const handleSaveFilter = async(filterName: string) => {
    if (user) {
      try {
        const response = await apiFetch(
          `${USER_FETCH_URL}/${user.id}/${USER_TABLE_FILTER_CHILD_URL}/null`,
          {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user.id,
              table_name: tableName,
              filter_name: filterName,
              filter: JSON.stringify(tableState.filter),
            }),
          }
        );
        //consoleInfo("handleSaveFilter response : ", response);

        await getResponseData(response, 'user-table-filter api error')
        addNotification('Filtre sauvegardé', 'success')
      }
      catch (err: any) {
        addNotification(String(err), 'error')
      }
    }
  };

  const handleExportXls = async () => {
    try {
      const mergedTableState = addTableStateFilter(tableState, permanentFilter)
      const response = await fetchAllData(mergedTableState);
      const json = await response.json();
      const allData = json.data;
      if (allData.length === 0) {
        addNotification("Aucune donnée à exporter", "warning");
        return;
      }

      exportToExcel(tableName, columns, allData)
    } 
    catch (err: any) {
      handleError('Export Xlsx', err, addNotification)
    }
  };

  const handleDefaultPrint = async () => {
    try {
      const mergedTableState = addTableStateFilter(tableState, permanentFilter)
      const response = await fetchAllData(mergedTableState);
      const json = await response.json();
      const allData = json.data;

      //consoleInfo("GenericListPage handleDefaultPrint allData : ", allData);

      if (allData.length === 0) {
        addNotification('Aucune donnée à imprimer !', 'info');
        return;
      }

      if (onPrint) {
        await onPrint(allData);
        return;
      }

      const doc = (
        <ReportLayout title={title} userId={user?.id}>
          <ReportList columns={columns} data={allData} />
        </ReportLayout>
      );

      await downloadPdf(doc, `${title}-List.pdf`);
    } 
    catch (err: any) {
      handleError('Default print for', err, addNotification)
    }
  };

  const { page, pageSize, sort, filter,  quickSearch } = tableState;

  const fetchDataCallback = useCallback(async () => {
    setLocalLoading(true);
    try {
      //await new Promise((resolve) => setTimeout(resolve, 100));
      //consoleInfo('GenericListPage fetchDataCallback tableState.filter: ', tableState.filter)
      //consoleInfo('GenericListPage fetchDataCallback permanentFilter: ', permanentFilter)
      const mergedTableState = addTableStateFilter(tableState, permanentFilter)
      const response = await fetchData(mergedTableState);
      //consoleInfo('GenericListPage fetchData response: ', response)
      const result = await response.json();
      //consoleInfo('GenericListPage fetchData result: ', result)
      if (result.error) {
        consoleError("GenericListPage fetchDataCallback api error: ", result.error);
        addNotification(result.error, "error");
        setData([]);
        setTotalRows(0);
      }
      else {
        setData(result.data);
        setTotalRows(result.total);
      }
    }
    catch (err: any) {
      handleError('GenericListPage fetchDataCallback api error for', err, addNotification)
      setData([]);
      setTotalRows(0);
    }
    finally {
      setLocalLoading(false);
    }
  }, [page, pageSize, sort, filter, quickSearch]);

  //const pathname = usePathname();

  const handleResfresh = async () => {
    await fetchDataCallback()
  };

  const handleShow = (item: T) => {
    const value = getId(item)
    const showUrl = childUrl ?  `${childUrl}/${value}` : `${value}`
    router.push(`${pathname}/${showUrl}`)
  };

  const handleAdd = () => {
    const value = 'null'
    const addUrl = childUrl ?  `${childUrl}/${value}` : `${value}`
    router.push(`${pathname}/${addUrl}`)
  };

  const handleEdit = (item: T) => {
    const value = `${getId(item)}?edit=true`
    const editUrl = childUrl ?  `${childUrl}/${value}` : `${value}`
    router.push(`${pathname}/${editUrl}`)
  };

  const renderActions = (item: T) => {
    if (isModalList) {
      return null
    }
    else {
      return (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton onClick={() => handleShow(item) } aria-label='Afficher'>
              <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(item) } color="primary" aria-label='Modifier'>
              <EditIcon />
          </IconButton>
        </Box>
      )
    }
  };

  //consoleInfo('GenericListPage lastViewedPath: ', `${url}/${lastViewedId}`)

  useEffect(() => {
    if (user) {
      const lvi = loadLastViewedId(user.id, tableName)
      //consoleInfo('GenericListPage ========1')
      //consoleInfo('GenericListPage lvi: ', lvi)
      setLastViewedId(lvi);
    }
    }, []);

  useEffect(() => {
    fetchDataCallback();
  }, [fetchDataCallback]);

  if (status === "loading" || authLoading) return <Loading />;
  if (!session || !user) return null;
  if (!authorized) return null;

  return (
    <Box>
      <ToolbarList
        quickSearch={tableState.quickSearch}
        onQuickSearchChange={(value) =>
          setTableState((prev) => ({
            ...prev,
            quickSearch: value,
            page: 0,
          }))
        }
        onRefresh={handleResfresh}
        onSaveView={handleSaveContext}
        onExport={handleExportXls}
        onPrint={handleDefaultPrint}
        onNew={handleAdd}
        lastViewedId={lastViewedId}
        lastViewedPath={`${lastViewedId}`}
        isModalList={isModalList}
        tableName={tableName}
        filter={tableState.filter}
        optionsMenu={optionsMenu}
        onSaveContext={handleSaveContext}
        onReadContext={handleReadContext}
        onSaveFilter={handleSaveFilter}
        onLoadFilter={handleLoadFilter}
      />
      <ReactTable<T>
        columns={columns}
        rows={data}
        total={totalRows}
        tableState={tableState}
        loading={localLoading || (loading ?? false)}
        onTableStateChange={setTableState}
        renderRowActions={isModalList ? undefined : renderActions}
        onRowClick={onRowClick}
      />
    </Box>
  );
}