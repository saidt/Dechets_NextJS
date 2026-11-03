import * as React from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface ErrorDialogProps extends DialogProps {  
  title: string, 
  content: string,
}

export default function ErrorDialog(props: ErrorDialogProps) {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>
        <WarningAmberIcon sx={{ marginRight: 3 ,color: 'red' }}/> 
        {props.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{props.content}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          startIcon={<CloseIcon />}
          onClick={() => props.onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}