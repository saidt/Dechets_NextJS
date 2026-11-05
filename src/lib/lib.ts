import { Filter, TableState } from "./types";

export function isObjectEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

export function removeEmptyValues(obj: object): object {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== "")
  );
}

export function getObjectDifferences<T extends Record<string, any>>(
  obj1: T,
  obj2: T
): Partial<T> {
  const diff: any = {};

  // Check all keys in obj2 (new/modified values)
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      // Key doesn't exist in obj1
      if (!(key in obj1)) {
        diff[key] = obj2[key];
      }
      // Both are objects, recurse - but include the whole object if any nested value differs
      else if (
        typeof obj1[key] === 'object' &&
        typeof obj2[key] === 'object' &&
        obj1[key] !== null &&
        obj2[key] !== null &&
        !Array.isArray(obj1[key]) &&
        !Array.isArray(obj2[key])
      ) {
        const nestedDiff = getObjectDifferences(obj1[key], obj2[key]);
        if (Object.keys(nestedDiff).length > 0) {
          diff[key] = obj2[key]; // Include the entire nested object
        }
      }
      // Values are different
      else if (obj1[key] !== obj2[key]) {
        diff[key] = obj2[key];
      }
    }
  }
  return diff;
}

export function emptyStringsToNull<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj; // Return primitives or null/undefined as is
  }

  if (Array.isArray(obj)) {
    // If it's an array, recursively process each element
    return obj.map(item => emptyStringsToNull(item)) as T;
  }

  // If it's a plain object, iterate over its properties
  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as any)[key];
      if (typeof value === 'string' && value === '') {
        newObj[key] = null; // Replace empty string with null
      } else if (typeof value === 'object' && value !== null) {
        newObj[key] = emptyStringsToNull(value); // Recursively process nested objects
      } else {
        newObj[key] = value; // Keep other values as they are
      }
    }
  }
  return newObj as T;
}

export function trimStrings<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj; // Return primitives or null/undefined as is
  }

  if (Array.isArray(obj)) {
    // If it's an array, recursively process each element
    return obj.map(item => trimStrings(item)) as T;
  }

  // If it's a plain object, iterate over its properties
  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as any)[key];
      if (typeof value === 'string' && value !== '') {
        newObj[key] = value.trim(); // Trim string
      } else if (typeof value === 'object' && value !== null) {
        newObj[key] = trimStrings(value); // Recursively process nested objects
      } else {
        newObj[key] = value; // Keep other values as they are
      }
    }
  }
  return newObj as T;
}

export function uniqueId(prefix = '') : string {
  return prefix + crypto.randomUUID();
}

export function addTableStateFilter<T extends Record<string, any>>(
  tableState: TableState<T>,
  otherFilter?: Filter<T>
) : TableState<T> {
  const cleanFilter : Filter<T> =  removeEmptyValues(tableState.filter)
  const mergedFilter = { ...cleanFilter, ...otherFilter };
  //consoleInfo('addTableStateFilter mergedFilter: ', mergedFilter)
  const mergedTableState: TableState<T> = {
    page: tableState.page,
    pageSize: tableState.pageSize,
    sort: tableState.sort,
    filter: mergedFilter,
    quickSearch: tableState.quickSearch
  }
  return mergedTableState
}

export function getCookie(name: string) {
  const cookieString = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return cookieString ? cookieString.split("=")[1] : null;
}

export function isDevMode() {
  return process.env.NODE_ENV === "development"
}