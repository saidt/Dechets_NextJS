"use client";

import MuiDialog from "@/components/ui/dialog/MuiDialog";
import { MuiDateTimePicker } from "@/components/form-show/Inputs";
import dayjs from "dayjs";
import { ExecuteButton } from "../ActionButtons";
import { DialogProps } from "@mui/material";

interface CmsDialogProps extends DialogProps {
  dateDeb: Date | null;
  dateFin: Date | null;
  setDateDeb: (value: Date | null) => void;
  setDateFin: (value: Date | null) => void;
  onExecuteClick?: () => void;
}

const PeriodeDialog = ({dateDeb, dateFin, setDateDeb, setDateFin, onExecuteClick, ...restProps}: CmsDialogProps) => {

  const PeriodeForm = () => (
    <>
      <MuiDateTimePicker
        name="dateDeb"
        label='Date début'
        value={dayjs(dateDeb)}
        onChange={(date) => setDateDeb(date ? date.toDate() : null)}
        mode={"Edit"}
        onClear={() => setDateDeb(null)}
        format="DD/MM/YYYY HH:mm:ss"
      />
      <MuiDateTimePicker
        name="dateFin"
        label='Date fin'
        value={dayjs(dateFin)}
        onChange={(date) => setDateFin(date ? date.toDate() : null)}
        mode={"Edit"}
        onClear={() => setDateFin(null)}
        format="DD/MM/YYYY HH:mm:ss"
      />
      <ExecuteButton onClick={onExecuteClick}>
        Exécuter
      </ExecuteButton>
    </>
  )

  return (
    <MuiDialog {...restProps}
      title="Période"
      children={ <PeriodeForm />}
      maxWidth={"xs"}
    />
  );
};

export default PeriodeDialog;