"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  DialogProps,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { Filter } from "@/lib/types";

export interface DataGridMenuProps<T extends Record<string, any>> extends DialogProps {
  filter: Filter<T>;
  tableName: string;
  onSaveFilter: (filterName: string) => void;
}

export default function UserTableFilterSaveDialog<T extends Record<string, any>>(props: DataGridMenuProps<T>) {
  const [filterName, setFilterName] = useState<string>("");

  const handleSaveFilter = () => {
    props.onSaveFilter(filterName)
    handleClose() 
  };
  
  const handleClose = () => {
    props.onClose ? props.onClose({}, "backdropClick") : null;
  };

  const textFilter = JSON.stringify(props.filter)

  return (
    <Dialog open={props.open}>
      <DialogTitle>Save Filter</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Filtre"
          fullWidth
          variant="outlined"
          value={textFilter}
          multiline
          maxRows={8}
          disabled
          sx={{ m: 1}}
        />
        <TextField
          autoFocus
          label="Nom du filtre"
          fullWidth
          variant="outlined"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          sx={{ m: 1}}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
          startIcon={<CancelIcon />}
          onClick={handleClose}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          startIcon={<CheckIcon />}
          onClick={handleSaveFilter}
          disabled={!filterName.trim()}
        >
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}