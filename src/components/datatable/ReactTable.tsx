import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Divider,
  Container,
  Box,
} from "@mui/material";
import { useState, useRef, useCallback, useEffect } from "react";
import { Column, Filter, TableState } from "@/lib/types";
import Pagination, { PaginationProps } from "./Pagination";
import { LoadingBar } from "../ui/LoadingBar";
import { formatValue } from "@/lib/number-utils";
import { FILTER_DEBOUCE_TIME } from "@/lib/consts";

const TablePagination = React.memo((props: PaginationProps) => {
  return (
    <Pagination
      {...props}
      currentPage={props.currentPage + 1}
      totalCount={props.totalCount}
      pageSize={props.pageSize}
      onPageChange={props.onPageChange}
      onPageSizeChange={props.onPageSizeChange}
    />
  );
});

export interface ReactTableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  rows: T[];
  total: number;
  tableState: TableState<T>;
  loading: boolean;
  renderRowActions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
  onTableStateChange: React.Dispatch<React.SetStateAction<TableState<T>>>;
}

export function ReactTable<T extends Record<string, any>>({
  columns,
  rows,
  total,
  tableState,
  loading,
  renderRowActions,
  onRowClick,
  onTableStateChange,
}: ReactTableProps<T>) {
  //consoleInfo('ReactTable onRowClick: ', onRowClick)

  const { page, pageSize, sort, filter } = tableState;
  const [localFilter, setLocalFilter] = useState<Filter<T>>(filter);
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const handleSort = (field: keyof T) => {
    onTableStateChange((prev) => {
      const isAsc = prev.sort?.field === field && prev.sort.direction === "asc";
      return {
        ...prev,
        page: 0,
        sort: { field, direction: isAsc ? "desc" : "asc" },
      };
    });
  };

  useEffect(() => {
    setLocalFilter(filter);
  }, [filter]);

  const handleFilterChange = useCallback(
    (field: keyof T, value: string) => {
      // 1. Update the input immediately so typing feels instant
      setLocalFilter((prev) => ({ ...prev, [field]: value }));

      // 2. Clear any pending timer for this field
      if (debounceTimers.current[field as string]) {
        clearTimeout(debounceTimers.current[field as string]);
      }

      // 3. Schedule the actual fetch-triggering update
      debounceTimers.current[field as string] = setTimeout(() => {
        onTableStateChange((prev) => ({
          ...prev,
          page: 0,
          filter: {
            ...prev.filter,
            [field]: value,
          },
        }));
      }, FILTER_DEBOUCE_TIME);
    },
    [onTableStateChange]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, []);

  const handlePageChange = (newPage: number) => {
    // newPage is 1-based
    onTableStateChange((prev) => ({ ...prev, page: newPage - 1 }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    onTableStateChange((prev) => ({ ...prev, page: 0, pageSize: newPageSize }));
  };

  const tableColumns: Column<T>[] = useMemo(() => {
    const cols = [...columns];
    if (renderRowActions) {
      cols.push({ accessor: "actions" as any, header: "Actions", width: 100 });
    }
    return cols;
  }, [columns, renderRowActions]);

  const tableRows = useMemo(() => {
    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={3} align="center">
            Aucun résultat
          </TableCell>
        </TableRow>
      );
    }

    return rows.map((row, rowIndex) => (
      <TableRow
        key={rowIndex}
        hover
        onClick={() => onRowClick && onRowClick(row)}
        sx={onRowClick ? { cursor: "pointer" } : {}}
      >
        {tableColumns.map((col: Column<T>) => {
          const raw = col.accessorFn ? col.accessorFn(row) : row[col.accessor];
          const { formatted, align } = formatValue(raw, col.meta?.decimals);
          return col.accessor !== "actions" ? (
            <TableCell
              key={String(col.accessor)}
              align={col.meta?.align ?? align}
              style={{ width: col.width, fontWeight: col.meta?.isPrimaryKey ? 'bold' : 'normal' }}
            >
              {formatted}
            </TableCell>
          ) : (
            <TableCell
              key={String(col.accessor)}
              align="center"
              style={{ width: 100 }}
            >
              {renderRowActions ? renderRowActions(row) : null}
            </TableCell>
          );
        })}
      </TableRow>
    ));
  }, [rows, loading]);

  return (
    <>
      <Container sx={{ width: "fit-content" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                {tableColumns.map((col) => (
                  <TableCell
                    key={`${String(col.accessor)}-header`}
                    style={{ width: col.width }}
                    align="center"
                  >
                    {col.accessor === "actions" ? (
                      col.header
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        <TableSortLabel
                          active={sort?.field === col.accessor}
                          direction={
                            sort?.field === col.accessor ? sort.direction : "asc"
                          }
                          onClick={() => handleSort(col.accessor)}
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            color: "primary.contrastText",

                            // 🔹 hide by default
                            "& .MuiTableSortLabel-icon": {
                              opacity: 0,
                              color: "primary.contrastText",
                            },

                            // 🔹 prevent hover from showing it
                            "&:hover .MuiTableSortLabel-icon": {
                              opacity: 0,
                            },

                            // 🔹 active label
                            "&.Mui-active": {
                              color: "primary.contrastText",
                            },

                            // 🔹 active icon ONLY
                            "&.Mui-active .MuiTableSortLabel-icon": {
                              opacity: 1,
                              color: "primary.contrastText",
                            },
                          }}
                        >
                          {col.header}
                        </TableSortLabel>
                      </Box>
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {tableColumns.map((col) => (
                  <TableCell key={`${String(col.accessor)}-filter`} sx={{ py: 1 }} style={{ width: col.width }}>
                    {col.accessor !== "actions" && (
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={localFilter[col.accessor]}
                        onChange={(e) => handleFilterChange(col.accessor, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell colSpan={tableColumns.length} style={{ padding: 0 }}>
                  <LoadingBar loading={loading} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{tableRows}</TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Divider />
      <TablePagination
        currentPage={page}
        totalCount={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );

}
