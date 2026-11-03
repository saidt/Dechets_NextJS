import React from "react";
import { Button, ButtonProps, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from '@mui/icons-material/Logout';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export interface TipButtonProps extends ButtonProps {
  tip: string;
}

export const TipButton: React.FC<TipButtonProps> = (props)  => {
  return (
    <Tooltip title={props.tip}>
      <Button {...props}
        variant="outlined"
        size="large"
        sx={{ pr: 1 }}
      >
        {props.children}
      </Button>
    </Tooltip>
  );
}

export const NewButton: React.FC<ButtonProps> = (props)  => {
  return (
    <TipButton {...props}
      color="warning"
      startIcon={<AddIcon />}
      tip="Ajouter"
    />
  );
};

export const DuplicateButton: React.FC<ButtonProps> = (props) => {
  return (
    <TipButton {...props}
      color="info"
      startIcon={<ContentCopyIcon />}
      tip="Dupliquer"
    >
      
    </TipButton>
  );
};

export const UpdateButton: React.FC<ButtonProps> = (props) => {
  return (
    <TipButton {...props}
      color="primary"
      startIcon={<EditIcon />}
      tip="Modifier"
    />
  );
};

export const DeleteButton: React.FC<ButtonProps> = (props) => {
  return (
    <TipButton {...props}
      color="error"
      startIcon={<DeleteIcon />}
      tip="Supprimer"
    />
  );
};

interface SaveButtonProps extends ButtonProps {
  isSaving?: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  isSaving,
  ...props
}) => {
  return (
    <TipButton {...props}
      color="success"
      startIcon={<SaveIcon />}
      disabled={isSaving}
      tip="Enregister"
    >
      {/*{isSaving ? "Sauvegarde..." : "Enregister"}*/}
    </TipButton>
  );
};

export const CancelButton: React.FC<ButtonProps> = (props) => {
  return (
    <TipButton {...props}
      color="error"
      startIcon={<CancelIcon />}
      tip="Annuler"
    />
  );
};

export const PrintButton: React.FC<ButtonProps> = (props) => {
  return (
    <TipButton {...props}
      color="secondary"
      startIcon={<PrintIcon />}
      tip="Imprimer"
    />
  );
};

export const RefreshButton: React.FC<ButtonProps> = (props) => {
  return (
    <TipButton {...props}
      color="success"
      startIcon={<RefreshIcon />}
      tip="Rafraîchir"
    />
  );
};

export const ExportButton: React.FC<ButtonProps> = (props) => {
  return (
    <TipButton {...props}
      startIcon={<FileDownloadIcon />}
      tip="Exporter"
    />
  );
};

export const OptionsButton: React.FC<ButtonProps> = (props) => {
  return (
    <TipButton {...props}
      color="inherit"  
      startIcon={<MenuIcon />}
      tip="Options"
    />
  );
};

export const LogoutButton: React.FC<ButtonProps> = (props) => {
  return (
    <TipButton {...props}
      color="secondary"  
      startIcon={<LogoutIcon />}
      tip="Logout"
    />
  );
};

export const ExecuteButton: React.FC<ButtonProps> = (props) => {
  return (
    <TipButton {...props}
      color="secondary"  
      startIcon={<PlayArrowIcon />}
      tip="Exécuter"
    />
  );
};

