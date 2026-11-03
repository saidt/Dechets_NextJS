"use client";

import { styled, Container, Box, useTheme } from "@mui/material";
import React, { useContext } from "react";
import Header from "./layout/vertical/header/Header";
import Sidebar from "./layout/vertical/sidebar/Sidebar";
import Customizer from "./layout/shared/Customizer";
import { CustomizerContext } from "@/app/context/customizerContext";
import AlertManager from "@/components/ui/AlertManager";

const MainWrapper = styled("div")(() => ({}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { activeLayout, isLayout, isCollapse } = useContext(CustomizerContext);

  const theme = useTheme();

  return (
    <MainWrapper>
      <title>MaterialPro NextJs 15.0.2 Admin Dashboard</title>
      {/* ------------------------------------------- */}
      {/* Header */}
      {/* ------------------------------------------- */}
      <Header />

      {/* ------------------------------------------- */}
      {/* Sidebar */}
      {/* ------------------------------------------- */}
      <Sidebar />

      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper
        className="page-wrapper"
        sx={{
          ...(activeLayout === 'vertical' && {
            [theme.breakpoints.up("lg")]: {
              ml: `256px`,
            },
          }),

          ...(isCollapse === "mini-sidebar" && {
            [theme.breakpoints.up("lg")]: {
              ml: `75px`,
            },
          }),
        }}

      >
        {/* PageContent */}
        <Container
          sx={{
            maxWidth: isLayout === 'boxed' ? 'lg' : '100%!important',
          }}
        >
          {/* ------------------------------------------- */}
          {/* PageContent */}
          {/* ------------------------------------------- */}
          <AlertManager />
          <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>
            {children}
          </Box>

          {/* ------------------------------------------- */}
          {/* End Page */}
          {/* ------------------------------------------- */}
        </Container>
        <Customizer />
      </PageWrapper>
    </MainWrapper>
  );
}