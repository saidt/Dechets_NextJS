import * as React from 'react';
import { Snackbar, Alert, AlertTitle, SnackbarCloseReason } from '@mui/material';

const Welcome = () => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };


  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleAlertClose = () => {
    setOpen(false);
  };
  
  React.useEffect(() => {
    // Update the document title using the browser API
    const timer = setTimeout(() => {
      handleClick();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <React.Fragment>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%', color: 'white' }}
        >
          <AlertTitle>Bienvenue sur le site de la gestion des déchets Imacab</AlertTitle>
          Gestion des déchets Imacab
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Welcome;
