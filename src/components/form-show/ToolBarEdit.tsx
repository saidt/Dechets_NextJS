"use client";

import React from 'react';
import { Box, Toolbar } from '@mui/material';
import {
  NewButton,
  UpdateButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  DuplicateButton,
  PrintButton,
  RefreshButton,
} from '@/components/ui/ActionButtons';
import useAuth from '@/app/context/UseAuth';
import FormShowMenu from './FormShowMenu';

interface ToolBarEditProps {
  isEditing: boolean;
  isSaving: boolean;
  tableName: string;
  optionsMenu?: React.ReactNode[];
  onRefresh: () => void;
  onNew?: () => void;
  onDuplicate?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onCancel: () => void;
  onPrint?: () => void;
}

const ToolBarEdit: React.FC<ToolBarEditProps> = ({
  isEditing,
  isSaving,
  tableName,
  optionsMenu,
  onRefresh,
  onNew,
  onDuplicate,
  onUpdate,
  onDelete,
  onSave,
  onCancel,
  onPrint,
}) => {

  const { hasRole } = useAuth();

  const canAdd = hasRole(tableName+'.ADD')
  const canUpdate = hasRole(tableName+'.UPDATE')
  const canDelete = hasRole(tableName+'.DELETE')
  const canPrint = hasRole(tableName+'.PRINT')

  return (
    <Toolbar
      sx={{
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "stretch",
      }}
    >
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
      {isEditing ? (
        <>
          {onSave && <SaveButton onClick={onSave} isSaving={isSaving} size="large" />}
          <CancelButton onClick={onCancel} disabled={isSaving} size="large" />
        </>
      ) : (
        <>
          {onRefresh && <RefreshButton onClick={onRefresh} />}
          {onNew && canAdd && <NewButton onClick={onNew} size="large" />}
          {onDuplicate && canAdd && <DuplicateButton onClick={onDuplicate} size="large" />}
          {onUpdate && canUpdate && <UpdateButton onClick={onUpdate} size="large" />}
          {onDelete && canDelete && <DeleteButton onClick={onDelete} size="large" />}
          {onPrint && canPrint && <PrintButton onClick={onPrint} size="large" />}
          {optionsMenu && <FormShowMenu optionsMenu={optionsMenu} tip={''} />}
        </>
      )}
    </Box>
    </Toolbar>
  );
};

export default ToolBarEdit;