import { consoleWarn } from "./clientLog";
import { DateStrToDate } from "./date-utils";
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

  // 4a. Column-specific filter
  const columnFilterClauses = (Object.keys(filter) as Array<keyof T>)
    .map(key => {
        // Plain string: 'contains' search; { value, exactFilter: true }: exact match
        const exact = isExactFilter(filter[key]);
        const filterValue = filterValueText(filter[key]);
        //consoleInfo(`tableStateToPrismaQuery key/filterValue: ${String(key)}/${filterValue}`)

        if (filterValue === null || filterValue === undefined || filterValue === '') {
            return null;
        }

        const fieldType = schema[key];
        //consoleInfo(`tableStateToPrismaQuery key/fieldType: ${String(key)}/${fieldType}`);
        let clause = {};

        switch (fieldType) {
        case PrismaFieldType.STRING:
            clause = { [key as string]: exact ? { equals: filterValue } : { contains: filterValue } };
            break;
        case PrismaFieldType.NUMBER:
            const numValue = parseFloat(filterValue);
            if (!isNaN(numValue)) {
            clause = { [key as string]: { equals: numValue } };
            }
            break;
        case PrismaFieldType.DATE:
            try {                
              const dateValue = DateStrToDate(filterValue);
              //consoleInfo(`tableStateToPrismaQuery filterValue/dateValue: ${filterValue}/${dateValue}`);
              if (!isNaN(dateValue.getTime())) {

                const startOfDay = new Date(Date.UTC(
                  dateValue.getFullYear(),
                  dateValue.getMonth(),
                  dateValue.getDate()
                ));
                //consoleInfo(`tableStateToPrismaQuery startOfDay: ${startOfDay}`);

                const endOfDay = new Date(Date.UTC(
                    dateValue.getFullYear(),
                    dateValue.getMonth(),
                    dateValue.getDate() + 1
                ));
                //consoleInfo(`tableStateToPrismaQuery endOfDay: ${endOfDay}`);

                clause = { [key as string]: { gte: startOfDay, lt: endOfDay } };
              }
            } 
            catch { /* Ignore invalid date strings */ }
            break;
        case PrismaFieldType.BOOLEAN:
            const lowerVal = filterValue.toLowerCase();
            if (['true', 'false', '1', '0', 'yes', 'no'].includes(lowerVal)) {
                const boolValue = ['true', '1', 'yes'].includes(lowerVal);
                clause = { [key as string]: { equals: boolValue } };
            }
            break;
        default:
            // Fallback for unknown types
            clause = { [key as string]: exact ? { equals: filterValue } : { contains: filterValue } };
            break;
        }
        
        return Object.keys(clause).length > 0 ? clause : null;
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