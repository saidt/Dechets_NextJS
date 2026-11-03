import { AlertColor } from '@mui/material/Alert';

export type SortDirection = 'asc' | 'desc';

export interface Sort<T extends Record<string, any>> {
  field: keyof T;
  direction: SortDirection;
}

export type Filter<T> = Partial<Record<keyof T, string>>;

export interface TableState<T extends Record<string, any>> {
  page: number;
  pageSize: number;
  sort: Sort<T> | null;
  filter: Filter<T>;
  quickSearch: string;
}

export interface PaginatedResponse<T extends Record<string, any>> {
  data: T[];
  total: number;
}

export type OrderBy = {
  [key: string]: 'asc' | 'desc' | OrderBy;
};

export interface PrismaQuery {
  skip?: number;
  take?: number;
  orderBy?: OrderBy[];
  where?: any;
}

export interface Column<T extends Record<string, any>> {
  accessor: keyof T;
  header: string;
  width: number;
  accessorFn?: (row: T) => string | number | Date;
  meta?: {
    isPrimaryKey?: true | false;
    align?: 'left' | 'right' | 'center' | 'justify';
    decimals?: number; 
  };
}

export interface Notification {
  id: number;
  message: string;
  severity: AlertColor;
}

export interface ListResponse {
  rows: any[];
  count: number;
}

export type Mode = "Browse" | "Create" | "Edit";

// Cm : Custom
export interface CmListProps<T extends Record<string, any>> {
  isModalList: boolean;
  initialFilter?: Filter<T>;
  permanentFilter?: Filter<T>;
  onRowClick? : (item: T) => void;
}