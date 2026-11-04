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

type PeriodeFormProps = {
  dateDeb: Date | null;
  dateFin: Date | null;
  setDateDeb: (value: Date | null) => void;
  setDateFin: (value: Date | null) => void;
  onExecuteClick?: () => void;
};

// Module level: a component declared inside PeriodeDialog would be a new type on
// every re-render, remounting the pickers and losing what the user is typing.
const PeriodeForm = ({ dateDeb, dateFin, setDateDeb, setDateFin, onExecuteClick }: PeriodeFormProps) => (
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

const PeriodeDialog = ({dateDeb, dateFin, setDateDeb, setDateFin, onExecuteClick, ...restProps}: CmsDialogProps) => {

  return (
    <MuiDialog {...restProps}
      title="Période"
      children={
        <PeriodeForm dateDeb={dateDeb} dateFin={dateFin} setDateDeb={setDateDeb} setDateFin={setDateFin} onExecuteClick={onExecuteClick} />
      }
      maxWidth={"xs"}
    />
  );
};

export default PeriodeDialog;