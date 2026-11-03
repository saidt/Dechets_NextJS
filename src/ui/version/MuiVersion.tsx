"use client";

import {
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { version } from "@mui/material";
import { useEffect, useState } from "react";

export default function MuiVersionDisplay() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Card variant="outlined" sx={{ p: 0 }}>
      <CardContent>
        <Stack direction="row" spacing={2}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography variant="subtitle1" color="warning">
              Material UI Version: {version}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
