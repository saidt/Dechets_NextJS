"use client"

import { createContext, useEffect, ReactNode, useState } from "react";
import { useSession } from "next-auth/react";
import { User_Type } from "@/types/user";
import { localLog } from "@/components/logger/localLog";
import { getUser, getUserRoles } from "@/lib/user";
import { consoleInfo } from "@/lib/clientLog";
import { getAllCookies } from "@/lib/html";
import { clientError } from "@/lib/error";
import { usePathname, useRouter } from "next/navigation";
import { ROLES_CACHE_KEY } from "@/lib/consts";

export type AuthContextType = {
  user: User_Type | null;
  authLoading: boolean;
  userError: Error | null;
  hasRole: (role: string) => boolean;
  hasAnyRole: (requiredRoles: string[]) => boolean;
  refreshAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const cacheUser = (user: User_Type) => {
    sessionStorage.setItem(ROLES_CACHE_KEY, JSON.stringify(user));
  };

  const getCachedUser = (): User_Type | null => {
    try {
      const cached = sessionStorage.getItem(ROLES_CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState<User_Type | null>(() => getCachedUser());
  const [userError, setUserError] = useState<Error | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  const { data: session, status } = useSession();
  const userId = session?.user.id;
  const router = useRouter()
  const pathName = usePathname()

  //consoleInfo("AuthProvider session: ", session);
  consoleInfo("AuthProvider userId: ", userId);

  const refreshAuth = async() => {
    if (!userId) {
      return
    }
    
    try {
      setAuthLoading(true)
      setUserError(null)
      //await new Promise((resolve) => setTimeout(resolve, 100));

      const [fetchedUser, roles] = await Promise.all([
        getUser(userId),
        getUserRoles(userId),
      ]);
      fetchedUser.roles = roles
      setUser(fetchedUser)
      cacheUser(fetchedUser);
      consoleInfo("AuthProvider fetchedUser: ", fetchedUser);
    }
    catch (err: any) {
      const allCookies = getAllCookies()
      const errStr = `refreshAuth: ${String(err)}`
      localLog("error", errStr, allCookies, {});
      setUserError(new Error(errStr));
      clientError('refreshAuth', err, pathName, router)
    }
    finally {
      setAuthLoading(false)
    }
  }

  const hasRole = (role: string) : boolean => {
    if (! user) { 
      return false;
    }
    return user.roles.includes(role.trim().toUpperCase())
  }

  function hasAnyRole(requiredRoles: string[]): boolean {
    if (! user) { 
      return false;
    }
    return requiredRoles.some(role =>
      user.roles.includes(role.trim().toUpperCase())
    );
  }

  //if (status === "loading" || authLoading) return <Loading />

  useEffect(() => {
    async function fetch_Auth() {
      if (status === "authenticated" && userId) {
        consoleInfo("AuthProvider fetch_User");
        const allCookies = getAllCookies();
        try {
          setUserError(null)
          await refreshAuth()       
        } 
        catch (err: any) {
          const errStr = `Fetch User: ${String(err)}`
          localLog("error", errStr, allCookies, {});
          setUserError(new Error(errStr));
          clientError('refreshAuth', err, pathName, router)
        }
      }
    }
    fetch_Auth();
  }, [session, session?.user, session?.user.id]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userError,
        authLoading,
        hasRole,
        hasAnyRole,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;