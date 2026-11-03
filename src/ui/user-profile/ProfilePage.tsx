'use client'

import { Grid, TextField, Toolbar } from "@mui/material";
import ProfileRoles from "./ProfileRoles";
import BlankCard from "../../components/shared/BlankCard";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/date-utils";
import {Divider } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TitleCard from "../../components/shared/TitleCard";
import { signOut, useSession } from "next-auth/react";
import { LogoutButton, RefreshButton } from "@/components/ui/ActionButtons";
import { LoadingBar } from "@/components/ui/LoadingBar";
import { useRouter } from "next/navigation";
import { clientError } from "@/lib/error";
import useAuth from "@/app/context/UseAuth";
import { ROLES_CACHE_KEY } from "@/lib/consts";
import { useAppContext } from "@/app/context/AppContext";

const TAB_STORAGE_KEY = "PROFILE_TAB";

const ProfilePage = () => {
  const [value, setValue] = useState(sessionStorage.getItem(TAB_STORAGE_KEY) || "1");
  const [formattedExpiresAt, setFormattedExpiresAt] = useState<string>('');
  const [lastConnected, setLastConnected] = useState<string>('');

  const { data: session, status } = useSession();
  const { authLoading, refreshAuth } = useAuth();
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
      clientError("ProfilePage: no user data!", null, curUrl, router);
    }
  }, [user, status, authLoading, curUrl, router]);

  //consoleInfo('ProfilePage user: ', user)
  //consoleInfo('ProfilePage session: ', session)
    
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    sessionStorage.setItem(TAB_STORAGE_KEY, value);
  }, [value]);

  async function handleRefresh(): Promise<void> {
    await refreshAuth();
    //setValue(1)
  }

  const handleLogout = async () => {
    sessionStorage.removeItem(ROLES_CACHE_KEY);
    signOut({ callbackUrl: "/auth/login", redirect: true })
  };

  const UserData = () => {
    return (
      <BlankCard>
        <Grid sx={{ m: 3 }}>
          <TextField
            label="Name"
            value={user?.name}
            slotProps={{ input: { readOnly: true } }}
            variant="outlined"
            fullWidth
            sx={{ m: 1 }}
          />

          <TextField
            label="Email"
            value={user?.email}
            slotProps={{ input: { readOnly: true } }}
            variant="outlined"
            fullWidth
            sx={{ m: 1 }}
          /> 

          <TextField
            label="Last connected"
            value={lastConnected}
            slotProps={{ input: { readOnly: true } }}
            variant="outlined"
            fullWidth
            sx={{ m: 1 }}
          /> 

          <TextField
            label="Session expires"
            value={formattedExpiresAt}
            slotProps={{ input: { readOnly: true } }}
            variant="outlined"
            fullWidth
            sx={{ m: 1 }}
          />

        </Grid>
      </BlankCard>
    )
  }

  useEffect(() => {
    if (session?.expiresAt) {
      setFormattedExpiresAt(formatDateTime(new Date(session.expiresAt)))
    }
    else {
      setFormattedExpiresAt('')
    }
  }, [session, session?.expiresAt]);

  useEffect(() => {
    if (user?.lastConnect) {
    setLastConnected(formatDateTime(new Date(user.lastConnect)))
  }
  else {
    setLastConnected('')
  }
  }, [user, user?.lastConnect]);

  //if (status === "loading" || authLoading) return <Loading />;
  if (!session || !user) return null;

  return (
    <TitleCard title="Profile de l'utilisateur">
      <LoadingBar loading={authLoading} />
      <Toolbar sx={{ gap: 2 }}>
        <RefreshButton onClick={handleRefresh}>
          Rafraîchir données et rôles
        </RefreshButton>
        <LogoutButton onClick={handleLogout}>
          Logout
        </LogoutButton>
      </Toolbar>

      <TabContext value={value}>
        <TextField
          label="Id"
          value={user.id}
          slotProps={{ input: { readOnly: true } }}
          variant="outlined"
          fullWidth
          sx={{ m: 2, mt: 3, pr: 4}}
        />

        <TabList
          onChange={handleTabChange} 
          sx={{
              "& .Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderRadius: 1,
              },
            }}
        >
          <Tab key={"1"} label='Utilisateur' value={"1"} />
          <Tab key={"2"} label='Rôles' value={"2"} />
        </TabList>
        <Divider />
        <TabPanel key={"1"} value={"1"}>
          <UserData />
        </TabPanel>
        <TabPanel key={"2"} value={"2"}>
          <ProfileRoles />
        </TabPanel>
      </TabContext>
    </TitleCard>
  );
};

export default ProfilePage;