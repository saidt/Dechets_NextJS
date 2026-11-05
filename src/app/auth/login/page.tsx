"use client";

import { Grid, Box, Avatar } from "@mui/material";
import AuthLogo from "@/app/(DashboardLayout)/layout/shared/logo/AuthLogo";
import { CustomizerContext } from "@/app/context/customizerContext";
import { useContext } from "react";
import PageContainer from "@/components/container/PageContainer";
import LoginForm from "@/ui/auth/LoginForm";
import { useSearchParams } from "next/navigation";
import { Credentials } from "@/types/credentials";

export default function Login() {
  const { activeMode } = useContext(CustomizerContext);

  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "SessionNotFound":
        return "Session not found !";
      case "SessionUiidNotFound":
        return "Session uuid not found !";        
      case "WrongResponse":
        return "Wrong response for session data !";
      case "DbSessionNotFound":
        return "Db session not found !";
      case "SessionExpired":
        return "Session expired !";
      case "SessionClientChanged":
        return "Session closed: used from another browser or network !";
      default:
        return null;
    }
  };

  const credentials : Credentials = {
    userId: process.env.NEXT_PUBLIC_USER_ID || '', 
    password: process.env.NEXT_PUBLIC_PASSWORD || '' 
  }

  const message = getErrorMessage();

  return (
    (
      <PageContainer title="Login Page">
        <Grid
          container
          spacing={0}
          sx={{
            height: "100vh",
            backgroundColor:
              activeMode == "light" ? "white" : "background.default",
            justifyContent: "center",
          }}
        >
          <Grid
            size={{
              xs: 12,
              sm: 12,
              lg: 5,
              xl: 4
            }}>
            <Box sx={{ px: 3 }}>
              <AuthLogo />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100% - 64px)"
              }}
            >
              <Grid
                size={{
                  xs: 12,
                  lg: 8
                }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{ p: 4 }}>
                    <LoginForm credentials={credentials} errorMsg={message} />
                  </Box>
                </Box>
              </Grid>
            </Box>
          </Grid>
          <Grid
            sx={{
              position: "relative",
              "&:before": {
                content: '""',
                background: "radial-gradient(#d2f1df,#d3d7fa,#bad8f4)",
                backgroundSize: "400% 400%",
                animation: "gradient 15s ease infinite",
                position: "absolute",
                height: "100%",
                width: "100%",
                opacity: "0.3",
              },
            }}
            size={{
              xs: 12,
              sm: 12,
              lg: 7,
              xl: 8
            }}>
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  display: {
                    xs: "none",
                    lg: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "calc(100vh - 75px)",
                  },
                }}
              >
                <Avatar
                  src={"/images/login.png"}
                  alt="bg"
                  sx={{
                    borderRadius: 0,
                    width: "100%",
                    height: "100%",
                    maxWidth: "370px",
                    maxHeight: "136px",
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </PageContainer>
  )
  );
}