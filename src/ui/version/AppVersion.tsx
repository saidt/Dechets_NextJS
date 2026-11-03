"use client";

import {
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { appVersion } from "@/app/version/app-version";

export default function NextJsVersion() {
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState<string>("...");

  useEffect(() => {
    async function fetchVersion() {
      //await new Promise((resolve) => setTimeout(resolve, 100)); // ???
      try {
        const version = await appVersion();
        setVersion(version);
      } 
      catch (err) {
        setVersion("error getting App version");
      }
      finally {
        setLoading(false);
      }
    }
    fetchVersion();
  }, []);

  return (
    <Card variant="outlined" sx={{ p: 0 }}>
      <CardContent>
        <Stack direction="row" spacing={2}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography variant="subtitle1" color="primary">
              App Version: {version}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
