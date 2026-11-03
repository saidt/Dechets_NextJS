import { Typography } from '@mui/material';

export default function ErrorMsg({error} : {error: string}) {
  return (
    <Typography color="error">
      {error}
    </Typography>
  );
}