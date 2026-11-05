import { Column, Filter, FilterValue, filterValueText, isExactFilter, Sort } from "./types";
import { formatValue } from "./number-utils";

// Safely get a (possibly nested, "a.b") property value
const resolvePath = (obj: any, path: string): any =>
  path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);

/** The text a table cell shows for a row: accessorFn if any, then the table's formatting. */
export function displayedValue<T extends Record<string, any>>(row: T, col: Column<T>): string {
  const raw = col.accessorFn ? col.accessorFn(row) : resolvePath(row, String(col.accessor));
  const { formatted } = formatValue(raw, col.meta?.decimals);
  return formatted === null || formatted === undefined ? '' : String(formatted);
}

/**
 * In-memory filtering. With columns, column filters and the quick search compare with
 * what the table displays (accessorFn, date and number formatting), so what the user
 * types matches what they see. Exact filters (permanentFilter) and filters without a
 * matching column compare with the raw value.
 */
export const applyFilter = <T extends Record<string, any>>(
  data: T[],
  filter: Filter<T>,
  quickSearch: string,
  columns?: Column<T>[]
): T[] => {
  let filteredData = [...data];

  // Helper to safely get nested property value
  const resolve = (obj: T, path: string): any => {
    return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
  };

  // Global filter: the displayed values of the columns (or all raw values without columns)
  if (quickSearch) {
    const globalSearch = quickSearch.toLowerCase();
    filteredData = filteredData.filter(item =>
      columns && columns.length > 0
        ? columns.some(col => displayedValue(item, col).toLowerCase().includes(globalSearch))
        : Object.values(item).some(val => String(val).toLowerCase().includes(globalSearch))
    );
  }

  // Column filters
  
  Object.entries(filter).forEach(([key, value]) => {
    const text = filterValueText(value as FilterValue);
    if (text) {
      // Plain string: 'contains' search; { value, exactFilter: true }: exact match
      // (trimmed, case-insensitive, like SQL Server equality)
      const exact = isExactFilter(value as FilterValue);
      const filterValue = exact ? text.trim().toLowerCase() : text.toLowerCase();

      const col = exact ? undefined : columns?.find(c => String(c.accessor) === key);

      filteredData = filteredData.filter(item => {
        const fieldValue = (col ? displayedValue(item, col) : String(resolve(item, key) ?? "")).toLowerCase();
        return exact ? fieldValue.trim() === filterValue : fieldValue.includes(filterValue);
      });
    }
  });

  return filteredData
}

export const applySort = <T extends Record<string, any>>(
  data: T[],
  sort: Sort<T> | null,
): T[] => {
  const sortedData = [...data];

  // Helper to safely get nested property value
  const resolve = (obj: T, path: string): any => {
    return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
  };

  // Sorting
  if (sort) {
    const { field, direction } = sort;
    sortedData.sort((a, b) => {
      const valA = resolve(a, String(field));
      const valB = resolve(b, String(field));

      if (valA < valB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  return sortedData
}

export const applyPagination = <T extends Record<string, any>>(
  data: T[],
  page: number,
  pageSize: number
): T[] => {
  const start = page * pageSize;
  const end = start + pageSize;
  const paginatedData = data.slice(start, end);
  return paginatedData
}