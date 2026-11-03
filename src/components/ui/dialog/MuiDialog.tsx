import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { IconButton } from "@mui/material";
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

export interface MuiDialogProps extends DialogProps {  
  title: string, 
  children: React.ReactNode
}

export default function MuiDialog(props: MuiDialogProps) {
  
  const handleClose = () => {
    props.onClose ? props.onClose({}, "backdropClick") : null;
  };
  
  return (
    <Dialog 
      open={props.open}
      onClose={(reason) => {
        if (reason === "backdropClick") return;
        if (reason === "escapeKeyDown") return;
       handleClose();
      }}      
      fullWidth
      maxWidth={props.maxWidth ? props.maxWidth : "lg"}
    >
      <DialogTitle sx={{ m: 0, p: 2, whiteSpace: 'pre-line' }}>
        {props.title}
        <IconButton
          aria-label="close"
          onClick={() => handleClose()}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CancelPresentationIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{props.content}</DialogContentText>
        {props.children}
      </DialogContent>
    </Dialog>
  );
}