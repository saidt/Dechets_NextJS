import * as React from 'react';
import Alert, { AlertColor, AlertPropsColorOverrides } from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { OverridableStringUnion } from '@mui/types';

export default function MuiAlert({severity, message } : {
  severity: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>, 
  message: string,
}) 
{
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      {open && (
        <Alert 
          variant="filled"
          severity={severity}
          onClose={handleClose}
        >
          {message}
        </Alert>
      )}
    </Stack>   
  );
}