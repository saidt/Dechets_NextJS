import * as XLSX from "xlsx";
import { Column } from "./types";
import { formatDate, isDateValue } from "./date-utils";
import { isNumber } from "./number-utils";
import { formatNumber } from "@/lib/number-utils";

export function exportToExcel<T extends Record<string, any>>(
  tableName: string,
  columns: Column<T>[],
  data: T[]
) {
  // Build rows based on columns (supports accessorFn)
  const rows = data.map((row) => {
    const excelRow: Record<string, any> = {};
    
    columns.forEach((col) => {
      let value;

      if (col.accessorFn) {
        value = col.accessorFn(row);
      }
      else {
        value = row[col.accessor];
      }

      if (isDateValue(value)) {
        excelRow[col.header] = formatDate(new Date(value));
      } 
      else if (isNumber(String(value))) {
        if (col.meta?.decimals) {
          excelRow[col.header] = formatNumber(Number(value), col.meta?.decimals);
        }
        else {
          excelRow[col.header] = Number(value);
        }
      }
      else {
        excelRow[col.header] = value;
      }
    });

    return excelRow;
  });

  // Create worksheet + workbook
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Export workbook to binary array
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Create blob just like your CSV function
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${tableName}.xlsx`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}