"use client";

import {
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { reactVersion } from "@/app/version/react-version";

export default function ReactVersion() {
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState<string>("loading...");

  useEffect(() => {
    async function fetchVersion() {
      try {
        const version = await reactVersion();
        setVersion(version);
      }
      catch (err) {
        setVersion("error fetching React version");
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
            <Typography variant="subtitle1" color="info">
              React Version: {version}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
