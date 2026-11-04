"use client";

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeSettings } from "@/utils/theme/Theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "@/utils/i18n";
import { AppProvider } from "./context/AppContext";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./context/AuthContext";
import { SESSION_UPDATE_AGE } from "@/lib/consts";

const MyApp = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => {
  const theme = ThemeSettings();

  return (
    <>
      {/* Re-read the session every SESSION_UPDATE_AGE: NextAuth renews the JWT cookie's
          expiry on each read, so the cookie slides along with the Session row. */}
      <SessionProvider session={session} refetchInterval={SESSION_UPDATE_AGE}>
        <AuthProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <AppProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
              </ThemeProvider>
            </AppProvider>
          </AppRouterCacheProvider>
        </AuthProvider>
      </SessionProvider>
    </>
  );
};

export default MyApp;