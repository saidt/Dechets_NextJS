import { USER_FETCH_URL, User_Type } from "@/types/user";
import { getAllCookies, getResponseJson } from "./html";
import { localLog } from "@/components/logger/localLog";
import { USER_ROLE_CHILD_URL, User_Role_Type } from "@/types/user-role";
import { TableState } from "./types";
import { fetchAllData } from "./fetchData";
import { fetch_User } from "@/fetch/user";
import { consoleInfo } from "./clientLog";

export const getUser = async(id: string) : Promise<User_Type> => {
  try {
    const response = await fetch_User(id);
    //consoleInfo("getUser response : ", response);
    const data = await getResponseJson(response)
    if (!response.ok) {
      const allCookies = getAllCookies();
      const errStr : string = data.error ? data.error : `getUSer: ${response.status} / ${response.statusText}`
      localLog("error", errStr, allCookies, {});
      return Promise.reject(null)
    }
    //consoleInfo("getUser data: ", data);
    return data
  }
  catch (err: any) {
    const allCookies = getAllCookies();
    const errStr = `getUSer user: ${String(err)}`
    localLog("error", errStr, allCookies, {});
    return Promise.reject(null)
  }
}

export const getUserRoles = async(id: string) : Promise< string[]> => {  
  try {
    const tableState : TableState<User_Role_Type> = {
      page: 0,
      pageSize: 0,
      sort: {field: 'role_id', direction: 'asc'},
      filter: {},
      quickSearch: ""
    }
    
    const response = await fetchAllData<User_Role_Type>(`${USER_FETCH_URL}/${id}/${USER_ROLE_CHILD_URL}`, tableState);
    const result = await response.json();
    consoleInfo("user getUserRoles result: ", result);

    if (!response.ok) {
      const allCookies = getAllCookies();
      const errStr : string = result.error ? result.error : `Fetch User Roles: ${response.status} / ${response.statusText}`
      localLog("error", errStr, allCookies, {});
      return Promise.reject(null)
    }

    const roles = result.data.map((role: User_Role_Type) => role.role_id.trim().toUpperCase());
    return roles
  }
  catch (err: any) {
    const allCookies = getAllCookies();
    const errStr = `Fetch user roles: ${String(err)}`
    localLog("error", errStr, allCookies, {});
    return Promise.reject(null)
  }
}