"use client";

import {
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { nextVersion } from "@/app/version/next-version";

export default function NextJsVersion() {
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState<string>("loading...");

  useEffect(() => {
    async function fetchVersion() {
      try {
        const version = await nextVersion();
        setVersion(version);
      }
      catch (err) {
        setVersion("error fetching Next version");
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
            <Typography variant="subtitle1" color="secondary">
              Next.js Version: {version}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
