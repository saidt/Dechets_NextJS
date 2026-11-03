import dayjs from 'dayjs';

export function formatDate(date: Date) : string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

export function formatDateTime(date: Date) : string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
}

export function serializeDates<T extends Record<string, any>>(entity: T): T {
  return Object.fromEntries(
    Object.entries(entity).map(([key, value]) => {
      // ✅ Native Date
      if (value instanceof Date) {
        return [key, value.toISOString()];
      }

      // ✅ Dayjs Date
      if (dayjs.isDayjs(value)) {
        return [key, value.toISOString()];
      }

      // ✅ Explicit null handling
      if (value === null) {
        return [key, null];
      }

      // ✅ Leave everything else untouched
      return [key, value];
    })
  ) as T;
}

export function isDateValue(value: any): boolean {
  if (value instanceof Date) return true;

  if (typeof value === "string") {
    // ✅ Only match ISO-like date strings
    return /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value);
  }

  return false;
}

export function DateStrToDate(value: string): Date {
  const [day, month, year] = value.split('/').map(Number);
  const dateValue = new Date(year, month-1, day);
  return dateValue
}