import { Filter, FilterValue, filterValueText, isExactFilter, Sort } from "./types";

export const applyFilter = <T extends Record<string, any>>(
  data: T[],
  filter: Filter<T>,
  quickSearch: string
): T[] => {
  let filteredData = [...data];

  // Helper to safely get nested property value
  const resolve = (obj: T, path: string): any => {
    return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
  };

  // Global filter
  if (quickSearch) {
    const globalSearch = quickSearch.toLowerCase();
    filteredData = filteredData.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(globalSearch)
      )
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

      filteredData = filteredData.filter(item => {
        const fieldValue = String(resolve(item, key) ?? "").toLowerCase();
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