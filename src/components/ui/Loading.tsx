import { Box, CircularProgress, Typography } from "@mui/material"

const Loading = () => {
    return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 3,
        padding: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={28} />
        <Typography variant="h6">Loading...</Typography>
      </Box>
    </Box>
  );
}   

export default Loading; 