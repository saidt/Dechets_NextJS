import { Filter, Sort } from "./types";

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
    if (value) {
      const filterValue = String(value).toLowerCase();

      filteredData = filteredData.filter(item => {
        const fieldValue = resolve(item, key);

        return String(fieldValue ?? "")
          .toLowerCase()
          .includes(filterValue);
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