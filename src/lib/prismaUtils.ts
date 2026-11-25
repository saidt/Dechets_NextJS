import { consoleWarn } from "./clientLog";
import { DateStrToDate } from "./date-utils";
import { FilterOperator, ParsedFilter, parseFilterOperator } from "./filterOperator";
import { filterValueText, isExactFilter, OrderBy, PrismaQuery, SortDirection, TableState } from "./types";

export enum PrismaFieldType {
  STRING,
  NUMBER,
  DATE,
  BOOLEAN,
}

export type PrismaSchema<T> = {
  [K in keyof T]?: PrismaFieldType;
};

function inferSchema<T extends object>(typeSource: T): PrismaSchema<T> {
    const schema: PrismaSchema<T> = {};
    (Object.keys(typeSource) as Array<keyof T>).forEach(key => {
        const value = typeSource[key];

        if (value instanceof Date) { // Handles Date objects directly
            schema[key] = PrismaFieldType.DATE;
        } else if (typeof value === 'number') {
            schema[key] = PrismaFieldType.NUMBER;
        } else if (typeof value === 'boolean') {
            schema[key] = PrismaFieldType.BOOLEAN;
        } else if (typeof value === 'string') {
            // Heuristic for date strings, in case the source object uses them
            if (/^\d{4}-\d{2}-\d{2}/.test(value) && !isNaN(new Date(value).getTime())) {
                schema[key] = PrismaFieldType.DATE;
            } else {
                schema[key] = PrismaFieldType.STRING;
            }
        } else {
            // Default for null, undefined, or other object types to allow basic text search
            schema[key] = PrismaFieldType.STRING;
        }
    });
    return schema;
}

const PRISMA_OPERATOR: Record<Exclude<FilterOperator, '='>, string> = {
  '>=': 'gte', '<=': 'lte', '>': 'gt', '<': 'lt', '<>': 'not',
};

/**
 * Text "like": % is a wildcard. "AB%" starts with, "%AB" ends with, "%AB%" contains;
 * with % inside ("A%B%C"), the start, end and middle parts are each required
 * (their order in the middle is not checked).
 */
function likeClause(key: string, pattern: string): object | null {
  const parts = pattern.split('%');
  const conditions: object[] = [];
  const first = parts[0];
  const last = parts[parts.length - 1];
  if (first) conditions.push({ [key]: { startsWith: first } });
  if (last && parts.length > 1) conditions.push({ [key]: { endsWith: last } });
  parts.slice(1, -1).filter(Boolean).forEach(middle => conditions.push({ [key]: { contains: middle } }));
  if (conditions.length === 0) return null; // only % : no filter
  return conditions.length === 1 ? conditions[0] : { AND: conditions };
}

/**
 * The Prisma where clause for one column filter.
 * - No operator: text contains (or like when it has %), number equals, date = that day.
 * - "=X", "<>X", ">=X", "<=X", ">X", "<X": compared with X. Dates are compared by day
 *   (DD/MM/YYYY): ">=01/10/2026" from that day on, "<01/10/2026" before it, "<>" not that day.
 * Returns null when the value can't be read for the column's type (no filter).
 */
function columnFilterClause(key: string, fieldType: PrismaFieldType | undefined, { op, value }: ParsedFilter): object | null {
  if (value === '') return null;

  switch (fieldType) {
  case PrismaFieldType.NUMBER: {
    const num = parseFloat(value);
    if (isNaN(num)) return null;
    if (op === null || op === '=') return { [key]: { equals: num } };
    return { [key]: { [PRISMA_OPERATOR[op]]: num } };
  }

  case PrismaFieldType.DATE: {
    const date = DateStrToDate(value);
    if (isNaN(date.getTime())) return null;
    const dayStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const nextDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 1));
    switch (op) {
    case '>=': return { [key]: { gte: dayStart } };
    case '>':  return { [key]: { gte: nextDay } };
    case '<=': return { [key]: { lt: nextDay } };
    case '<':  return { [key]: { lt: dayStart } };
    case '<>': return { OR: [{ [key]: { lt: dayStart } }, { [key]: { gte: nextDay } }] };
    default:   return { [key]: { gte: dayStart, lt: nextDay } }; // that day
    }
  }

  case PrismaFieldType.BOOLEAN: {
    const lower = value.toLowerCase();
    if (!['true', 'false', '1', '0', 'yes', 'no'].includes(lower)) return null;
    const bool = ['true', '1', 'yes'].includes(lower);
    return op === '<>' ? { [key]: { not: bool } } : { [key]: { equals: bool } };
  }

  default: // STRING and unknown types
    if (op === null) return value.includes('%') ? likeClause(key, value) : { [key]: { contains: value } };
    if (op === '=') return { [key]: { equals: value } };
    return { [key]: { [PRISMA_OPERATOR[op]]: value } };
  }
}

export function tableStateToPrismaQuery<T extends object>(
  state: TableState<T>,
  typeSource: T,
  globalSearchFields: (keyof T)[]
): PrismaQuery {
  const { page, pageSize, sort, filter, quickSearch } = state;

  // 1. Derive the schema from the type source object at runtime
  const schema = inferSchema(typeSource);
  
  // 1b. Validate globalSearchFields (runtime check for development convenience)
  globalSearchFields.forEach(field => {
    if (!(field in typeSource)) {
      consoleWarn(`[prismaUtils] The field "${String(field)}" provided in globalSearchFields does not exist on the type source object.`);
    }
  });

  // 2. Pagination
  const queryArgs: PrismaQuery = {
    skip: page * pageSize,
    take: pageSize,
  };

  // 3. Sorting
  if (sort) {
    const buildOrderBy = (field:  keyof T, direction: SortDirection) : OrderBy => {
      if (String(field).includes(".")) {
        const [relation, nestedField] = String(field).split(".");
        return {
          [relation]: {
            [nestedField]: direction
          }
        };
      }
      return { [field]: direction };
    };

    queryArgs.orderBy = [buildOrderBy(sort.field, sort.direction)];
  }

  // 4. Filtering
  const allWhereClauses: any[] = [];

  // 4a. Column-specific filter (operators: see parseFilterOperator / columnFilterClause)
  const columnFilterClauses = (Object.keys(filter) as Array<keyof T>)
    .map(key => {
        const filterValue = filterValueText(filter[key]);
        if (filterValue === null || filterValue === undefined || filterValue.trim() === '') {
            return null;
        }
        // { value, exactFilter: true }: exact match, operators not read
        const parsed: ParsedFilter = isExactFilter(filter[key])
          ? { op: '=', value: filterValue }
          : parseFilterOperator(filterValue);
        return columnFilterClause(String(key), schema[key], parsed);
    })
    .filter(c => c !== null);

  if (columnFilterClauses.length > 0) {
      allWhereClauses.push({ AND: columnFilterClauses });
  }

  // 4b. Global filter
  if (quickSearch && globalSearchFields.length > 0) {
    const quickSearchORClauses = globalSearchFields
        .map(field => {
            const fieldType = schema[field];
            switch (fieldType) {
                case PrismaFieldType.STRING:
                    return { [field as string]: { contains: quickSearch } };
                case PrismaFieldType.NUMBER:
                    const numValue = parseFloat(quickSearch);
                    return isNaN(numValue) ? null : { [field as string]: { equals: numValue } };
                default:
                    // Don't search non-string/number fields (like dates) with a global text filter
                    return null;
            }
        })
        .filter(c => c !== null); 

    if(quickSearchORClauses.length > 0) {
        allWhereClauses.push({ OR: quickSearchORClauses });
    }
  }

  // 4c. Combine all top-level clauses with AND
  if (allWhereClauses.length > 0) {
    queryArgs.where = allWhereClauses.length === 1 ? allWhereClauses[0] : { AND: allWhereClauses };
  }

  return queryArgs;
}