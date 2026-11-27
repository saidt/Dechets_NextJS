import { Column, Filter, FilterValue, filterValueText, isExactFilter, Sort } from "./types";
import { formatValue } from "./number-utils";
import { DateStrToDate } from "./date-utils";
import { FilterOperator, likeToRegExp, ParsedFilter, parseFilterOperator } from "./filterOperator";

// Safely get a (possibly nested, "a.b") property value
const resolvePath = (obj: any, path: string): any =>
  path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);

/** The text a table cell shows for a row: accessorFn if any, then the table's formatting. */
export function displayedValue<T extends Record<string, any>>(row: T, col: Column<T>): string {
  const raw = col.accessorFn ? col.accessorFn(row) : resolvePath(row, String(col.accessor));
  const { formatted } = formatValue(raw, col.meta?.decimals);
  return formatted === null || formatted === undefined ? '' : String(formatted);
}

// A date's day as YYYYMMDD, in local time like the displayed dates; null if not a date
const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;
function dayNumber(raw: unknown): number | null {
  const date = raw instanceof Date ? raw : typeof raw === 'string' && ISO_DATE.test(raw) ? new Date(raw) : null;
  if (!date || isNaN(date.getTime())) return null;
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

function compare(a: number | string, b: number | string, op: FilterOperator): boolean {
  switch (op) {
  case '=':  return a === b;
  case '<>': return a !== b;
  case '>=': return a >= b;
  case '>':  return a > b;
  case '<=': return a <= b;
  case '<':  return a < b;
  }
}

/**
 * One column filter on one row, with the operators of server lists (filterOperator.ts):
 * - no operator: the displayed text contains the value (or matches it as "like" with %);
 * - with an operator: dates (DD/MM/YYYY) are compared by day, numbers (typeof number) as numbers, other
 *   values on the displayed text (case-insensitive). Empty values never match an
 *   operator, as in SQL.
 */
function matchesFilter(raw: unknown, shown: string, { op, value }: ParsedFilter): boolean {
  const text = shown.toLowerCase();
  if (op === null) {
    return value.includes('%') ? likeToRegExp(value).test(shown.trim()) : text.includes(value.toLowerCase());
  }
  if (raw === null || raw === undefined || raw === '') return false;

  const rowDay = dayNumber(raw);
  if (rowDay !== null) {
    const wanted = DateStrToDate(value);
    if (isNaN(wanted.getTime())) return false;
    return compare(rowDay, wanted.getFullYear() * 10000 + (wanted.getMonth() + 1) * 100 + wanted.getDate(), op);
  }

  // Numbers by the variable's type: a string made of digits is compared as text
  const num = typeof raw === 'number' ? raw : NaN;
  const wantedNum = parseFloat(value);
  if (!isNaN(num) && !isNaN(wantedNum)) {
    return compare(num, wantedNum, op);
  }

  return compare(text.trim(), value.toLowerCase(), op);
}

/**
 * In-memory filtering. With columns, column filters and the quick search compare with
 * what the table displays (accessorFn, date and number formatting), so what the user
 * types matches what they see. Column filters accept the server lists' operators
 * (matchesFilter). Exact filters (permanentFilter) compare with the raw value.
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
    if (!text || !text.trim()) return;

    // { value, exactFilter: true } (permanentFilter): exact match on the raw value
    // (trimmed, case-insensitive, like SQL Server equality); operators not read
    if (isExactFilter(value as FilterValue)) {
      const wanted = text.trim().toLowerCase();
      filteredData = filteredData.filter(item => String(resolve(item, key) ?? "").trim().toLowerCase() === wanted);
      return;
    }

    const parsed = parseFilterOperator(text);
    if (parsed.value === '') return;
    const col = columns?.find(c => String(c.accessor) === key);
    filteredData = filteredData.filter(item => matchesFilter(resolve(item, key), col ? displayedValue(item, col) : String(resolve(item, key) ?? ""), parsed));
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