"use client";

import {
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { nextAuthVersion } from "@/app/version/next-auth-version";

export default function NextJsVersion() {
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState<string>("loading...");

  useEffect(() => {
    async function fetchVersion() {
      try {
        const version = await nextAuthVersion();
        setVersion(version);
      }
      catch (err) {
        setVersion("error fetching NextAuth version");
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
            <Typography variant="subtitle1" color="success">
              NextAuth Version: {version}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
