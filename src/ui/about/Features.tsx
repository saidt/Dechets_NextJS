import { Box } from "@mui/material";

const Features = () => {
  return (
    <Box component="ul" sx={{ pl: 2, listStyleType: "disc" }}>
      <Box sx={{ m: 1}} component="li">Authentication with database session management</Box>
      <Box sx={{ m: 1}} component="li">Authentication with SHA256 hash stored password</Box>
      <Box sx={{ m: 1}} component="li">
        /protected/* and /api/protected/* only allowed for authenticated users
      </Box>
      <Box sx={{ m: 1}} component="li">All actions via api routes</Box>
      <Box sx={{ m: 1}} component="li">Dashboard</Box>
      <Box sx={{ m: 1}} component="li">
        List with server pagination, quick searching, sorting and filtering
      </Box>
      <Box sx={{ m: 1}} component="li">
        Memory list with pagination, quick searching, sorting and filtering
      </Box>
      <Box sx={{ m: 1}} component="li">CRUD operations</Box>
      <Box sx={{ m: 1}} component="li">Breadcrumbs</Box>
      <Box sx={{ m: 1}} component="li">Closables alerts</Box>      
      <Box sx={{ m: 1}} component="li">Reusable components...</Box>
      <Box sx={{ m: 1}} component="li">Save and restore last user sort, filter and accessed item per table</Box>
      <Box sx={{ m: 1}} component="li">Load global filters per table</Box>
      <Box sx={{ m: 1}} component="li">Save and load user filters per table</Box>
    </Box>
  );
};

export default Features;