"use client";

import BlankCard from "../../components/shared/BlankCard";
import { getAllCookies } from "@/lib/html";
import { GenericMemListPage } from "@/components/datatable/GenericMemListPage";
import { TableState } from "@/lib/types";
import { USER_ROLE_CHILD_URL, user_Role_Columns, User_Role_Type } from "@/types/user-role";
import { useSession } from "next-auth/react";
import { USER_FETCH_URL } from "@/types/user";
import { fetchAllData } from "@/lib/fetchData";
import { localLog } from "@/components/logger/localLog";
import { useRouter } from "next/navigation";
import useAuth from "@/app/context/UseAuth";
import { useEffect } from "react";
import { clientError } from "@/lib/error";
import { useAppContext } from "@/app/context/AppContext";
//import { consoleInfo } from "@/lib/log";

const ProfileRoles = () => {
  //consoleInfo('ProfileRoles user: ', user)

  const { data: session, status } = useSession();
  const { authLoading } = useAuth();
  const router = useRouter();
  const { getCurrentUrl } = useAppContext();
    const curUrl = getCurrentUrl()
  const user = session?.user;

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("Session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]);

  useEffect(() => {
    if (status !== "loading" && !authLoading && (!user || !user.id)) {
      clientError("ProfileRoles: no user data!", null, curUrl, router);
    }
  }, [user, status, authLoading, curUrl, router]);


  async function fetchAllRows() : Promise<User_Role_Type[]> {
    if (! user) {
      return Promise.reject(null)
    }
    try {
      const tableState : TableState<User_Role_Type> = {
        page: 0,
        pageSize: 0,
        sort: {field: 'role_id', direction: 'asc'},
        filter: {},
        quickSearch: ""
      }
      
      const response = await fetchAllData<User_Role_Type>(`${USER_FETCH_URL}/${user.id}/${USER_ROLE_CHILD_URL}`, tableState);
      const result = await response.json();
      //consoleInfo("user getUserRoles result: ", result);

      if (!response.ok) {
        const allCookies = getAllCookies();
        const errStr : string = result.error ? result.error : `Fetch User Roles: ${response.status} / ${response.statusText}`
        localLog("error", errStr, allCookies, {});
        return Promise.reject(null)
      }

      return result.data
    }
    catch (err: any) {
      const allCookies = getAllCookies();
      const errStr = `Fetch user roles: ${String(err)}`
      localLog("error", errStr, allCookies, {});
      return Promise.reject(null)
    }
  }

  if (!session || !user) return null;

  return (
    <BlankCard>
      <GenericMemListPage<User_Role_Type>
        title="Rôles d'un utilisateur"
        columns={user_Role_Columns}
        isModalList={false}
        fetchAllData={fetchAllRows}
        //getId={(user_Role_Type: User_Role_Type) => user_Role_Type.id}
        loading={authLoading}
      />
    </BlankCard>
  );
};

export default ProfileRoles;