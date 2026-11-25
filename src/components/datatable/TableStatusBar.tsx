"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { Column, filterValueText, isExactFilter, TableState } from "@/lib/types";

export interface TableStatusBarProps<T extends Record<string, any>> {
  columns: Column<T>[];
  tableState: TableState<T>;
}

// Module level: a component declared inside another one is a new type on every render
const Item = ({ label, value }: { label: string; value: string }) => (
  <Typography variant="body2" component="span">
    <Typography variant="body2" component="span" color="text.secondary">{label} : </Typography>
    {value}
  </Typography>
);

/**
 * Reports the list's current sort, column filters and quick search (tableState),
 * above the pagination. Display only. Filters fixed by the screen
 * (permanentFilter, parent filter) are not in tableState, so they are not shown.
 */
export function TableStatusBar<T extends Record<string, any>>({
  columns,
  tableState,
}: TableStatusBarProps<T>) {
  const { sort, filter, quickSearch } = tableState;

  const header = (field: keyof T) =>
    columns.find((c) => c.accessor === field)?.header ?? String(field);

  const filters = (Object.keys(filter) as (keyof T)[])
    .filter((field) => filterValueText(filter[field]).trim() !== "")
    .map((field) => `${header(field)} ${isExactFilter(filter[field]) ? "=" : ":"} « ${filterValueText(filter[field])} »`);

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
      <Item label="Tri" value={sort ? `${header(sort.field)} ${sort.direction === "asc" ? "↑ croissant" : "↓ décroissant"}` : "aucun"} />
      <Item label="Filtres" value={filters.length > 0 ? filters.join(", ") : "aucun"} />
      <Item label="Recherche" value={search !== "" ? `« ${search} »` : "aucune"} />
    </Box>
  );
}
