import { Box, LinearProgress } from "@mui/material";

export const LoadingBar = ({ loading }: { loading: boolean }) => (
  <Box sx={{ height: 4 }}>
    {loading ? (
      <LinearProgress />
    ) : (
      // Empty bar with same height to keep layout stable
      <Box sx={{ height: "4px", visibility: "hidden" }}>
        <LinearProgress />
      </Box>
    )}
  </Box>
);
