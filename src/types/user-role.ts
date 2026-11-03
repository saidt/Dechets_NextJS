import { Column, Sort } from "@/lib/types"
import { Role_Type } from "./role"

export const USER_ROLE_TABLE_NAME: string = 'dbo.USER_ROLE'
export const USER_ROLE_CHILD_URL: string = "role"
export const USER_ROLE_URL: string = "/protected/user-role"
export const USER_ROLE_LIST_TITLE: string = "Rôles d'utilisateur"
export const USER_ROLE_DEFAULT_SORT : Sort<User_Role_Type> =  {field: 'id', direction: 'asc'}

export type User_Role_Type = {
  id: number;
  user_id: string;
  role_id: string;
  role: Role_Type | null;
};

export const Empty_User_Role : User_Role_Type = {
  id: 0,
  user_id: '',
  role_id: '',
  role: null
};

export const user_Role_Columns: Column<User_Role_Type>[] = [
  {
    accessor: "id" as keyof User_Role_Type,
    header: "Id",
    width: 150,
    meta: { isPrimaryKey: true, align: "right" },
  },
  {
    accessor: "role_id" as keyof User_Role_Type,
    header: "Rôle",
    width: 150,
  },
  {
    accessor: "role.description" as keyof User_Role_Type,
    header: "Description",
    width: 300,
    accessorFn: (row: User_Role_Type) => row?.role?.description || "",
  },
];