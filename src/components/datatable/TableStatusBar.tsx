"use client";

import { Box, Typography } from "@mui/material";
import { Column, Filter, filterValueText, isExactFilter, TableState } from "@/lib/types";

export interface TableStatusBarProps<T extends Record<string, any>> {
  columns: Column<T>[];
  tableState: TableState<T>;
  // Filter fixed by the screen (not in tableState); shown only when it has values
  permanentFilter?: Filter<T>;
}

// Module level: a component declared inside another one is a new type on every render
const Item = ({ label, value }: { label: string; value: string }) => (
  <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
    <Typography variant="body2" component="span" color="text.secondary" sx={{ fontWeight: 600 }}>{label} : </Typography>
    {value}
  </Typography>
);

/**
 * Reports the list's current sort, column filters and quick search (tableState),
 * and the screen's permanentFilter when it has one, above the pagination.
 * Display only. The parent filter of child lists is added by the API route, so
 * it is not shown.
 */
export function TableStatusBar<T extends Record<string, any>>({
  columns,
  tableState,
  permanentFilter,
}: TableStatusBarProps<T>) {
  const { sort, filter, quickSearch } = tableState;

  const header = (field: keyof T) =>
    columns.find((c) => c.accessor === field)?.header ?? String(field);

  // "Column : « text »", or "Column = « text »" for an exact filter
  const describe = (f: Filter<T> | undefined): string[] =>
    (Object.keys(f ?? {}) as (keyof T)[])
      .filter((field) => filterValueText(f?.[field]).trim() !== "")
      .map((field) => `${header(field)} ${isExactFilter(f?.[field]) ? "=" : ":"} [ ${filterValueText(f?.[field])} ]`);

  const filters = describe(filter);
  const fixedFilters = describe(permanentFilter);

  const search = quickSearch?.trim() ?? "";

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        columnGap: 3,
        rowGap: 0.5,
        px: 1,
        py: 0.75,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Item label="Tri" value={sort ? `${header(sort.field)} ${sort.direction === "asc" ? "↑" : "↓"}` : ""} />
      <Item label="Filtres" value={filters.length > 0 ? filters.join(", ") : ""} />
      <Item label="Recherche" value={search !== "" ? `[ ${search} ]` : ""} />
      {fixedFilters.length > 0 && <Item label="Filtre fixe" value={fixedFilters.join(", ")} />}
    </Box>
  );
}
