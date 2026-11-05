import SaveIcon from "@mui/icons-material/Save";
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import HistoryIcon from "@mui/icons-material/History";
import { ListItemIcon, MenuItem, MenuItemProps } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LogoutIcon from '@mui/icons-material/Logout';

interface LastAccessedMenuProps extends MenuItemProps {
  lastAccessed: number | string | null;
}

export const LastAccessedMenu  = ({lastAccessed, ...props}: LastAccessedMenuProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <HistoryIcon color="primary" />
      </ListItemIcon>
      Last accessed ({lastAccessed})
    </MenuItem>
  );
};

export const SaveContextMenu = (props : MenuItemProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <SaveIcon color="success" />
      </ListItemIcon>
      Enregistrer contexte
    </MenuItem>
  );
};

export const ReadContextMenu = (props : MenuItemProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <SettingsBackupRestoreIcon color="secondary"/>
      </ListItemIcon>
      Charger contexte
    </MenuItem>
  );
};

export const SaveFilterMenu = (props : MenuItemProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <FileUploadIcon color="info"/>
      </ListItemIcon>
      Enregistrer filtre
    </MenuItem>
  );
};

export const ReadFilterMenu = (props : MenuItemProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <DownloadIcon color="warning"/>
      </ListItemIcon>
      Charger filtre
    </MenuItem>
  );
};

export const ValiderMenu = (props : MenuItemProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <CheckCircleIcon color="primary"/>
      </ListItemIcon>
      Valider
    </MenuItem>    
  );
};

export const DevaliderMenu = (props : MenuItemProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <UnpublishedIcon color="primary"/>
      </ListItemIcon>
      Dévalider
    </MenuItem>    
  );
};

export const ControleMenu = (props : MenuItemProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <DoneAllIcon color="secondary"/>
      </ListItemIcon>
      Contrôlé
    </MenuItem>    
  );
};

export const NonControleMenu = (props : MenuItemProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <RemoveDoneIcon color="secondary"/>
      </ListItemIcon>
      Non contrôlé
    </MenuItem>    
  );
};

export const VerifierMenu = (props : MenuItemProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <DoneAllIcon color="error"/>
      </ListItemIcon>
      Vérifier
    </MenuItem>    
  );
};

export const CorrigerMenu = (props : MenuItemProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <ThumbUpOffAltIcon color="secondary"/>
      </ListItemIcon>
      Corriger
    </MenuItem>    
  );
};

interface StatistiqueMenuProps extends MenuItemProps {
  caption: string;
}

export const ImporterMenu = (props : MenuItemProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <FileDownloadIcon color="secondary"/>
      </ListItemIcon>
      Importer
    </MenuItem>    
  );
};

interface StatistiqueMenuProps extends MenuItemProps {
  caption: string;
}

export const StatistiqueMenu = ({caption, ...restProps} : StatistiqueMenuProps) => {
  return (
    <MenuItem {...restProps}>
      <ListItemIcon>
        <SignalCellularAltIcon color="secondary"/>
      </ListItemIcon>
      {caption}
    </MenuItem>    
  );
};

export const TerminateOtherSessionsMenu = (props : MenuItemProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <LogoutIcon color="error" />
      </ListItemIcon>
      Terminer les autres sessions
    </MenuItem>
  );
};
