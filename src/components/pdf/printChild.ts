import { fetchAllData } from "@/lib/fetchData";
import { getResponseData } from "@/lib/html";
import { TableState } from "@/lib/types";

/**
 * Loads a child list (lines, details) for a record print.
 * Returns null when the user doesn't have the child's <TABLE>.LIST role: the print
 * leaves that list out, as the record's page hides its tab. Throws when the API
 * answers with an error, so the print stops with that message instead of printing
 * the record without its lines.
 */
export async function fetchChildForPrint<T extends Record<string, any>>(
  hasRole: (role: string) => boolean,
  tableName: string,
  url: string,
  tableState: TableState<T>,
): Promise<T[] | null> {
  if (!hasRole(`${tableName}.LIST`)) {
    return null;
  }
  const response = await fetchAllData<T>(url, tableState);
  const json = await getResponseData(response, `${tableName} print`);
  return json.data ?? [];
}
