import { Box, Button, Divider, IconButton } from "@mui/material";
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent }  from "@mui/material";
import Features from "./Features";
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

const Libraries = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const showFeatures = () => {
    setOpenDialog(true)
  }
  
  return (
    <>
    <Box component="ul" sx={{ pl: 3, listStyleType: "disc" }}>
      <Box sx={{ m: 1}} component="li">React framework</Box>
      <Box sx={{ m: 1}} component="li">TypeScript</Box>
      <Box sx={{ m: 1}} component="li">Material UI (MUI)</Box>
      <Box sx={{ m: 1}} component="li">MUI DataGrid</Box>
      <Box sx={{ m: 1}} component="li">MUI Charts</Box>
      <Box sx={{ m: 1}} component="li">MUI DateTime picker</Box>
      <Box sx={{ m: 1}} component="li">
        NextAuth with authentication and database session management
      </Box>
      <Box sx={{ m: 1}} component="li">React hook form</Box>
      <Box sx={{ m: 1}} component="li">Prisma</Box>
      <Box sx={{ m: 1}} component="li">MS SQL Prisma adapter</Box>
      <Box sx={{ m: 1}} component="li">Zod validation</Box>
      <Box sx={{ m: 1}} component="li">Tailwindcss</Box>
      <Box sx={{ m: 1}} component="li">React-pdf/render</Box>
    </Box>

    <Button
      variant="contained" 
      startIcon={<FormatListNumberedIcon />}
      sx={{ m: 2, mb: 4 }}
      onClick={() => showFeatures()}
    >
      Features
    </Button>

    <Divider />

    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Features
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CancelPresentationIcon  />
          </IconButton>
        </DialogTitle>
        <DialogTitle>Features</DialogTitle>
        <DialogContent>
        <Features />
        </DialogContent>
    </Dialog>
</>
  );
};

export default Libraries;