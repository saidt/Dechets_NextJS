import { Sort } from '@/lib/types';

export const USER_TABLE_FILTER_TABLE_NAME: string = 'dbo.USER_TABLE_FILTER'
export const USER_TABLE_FILTER_CHILD_URL: string = "table-filter"
export const USER_TABLE_FILTER_LIST_TITLE: string = 'Filtres utilisateur'
export const USER_TABLE_FILTER_DEFAULT_SORT: Sort<User_Table_Filter_Type> = { field: 'id', direction: 'asc' }

export type User_Table_Filter_Type = {
  id: number,
  user_id: string,
  table_name: string,
  filter_name: string,
  type: 'GLOBAL' | 'USER',
  filter: string
};

export const Empty_User_Table_Filter: User_Table_Filter_Type = {
  id: 0,
  user_id: '',
  table_name: '',
  filter_name: '',
  type: 'USER',
  filter: ""
};