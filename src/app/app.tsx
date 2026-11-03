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
      <SessionProvider session={session}>
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