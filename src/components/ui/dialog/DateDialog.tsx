"use client";

import MuiDialog from "@/components/ui/dialog/MuiDialog";
import { MuiDateTimePicker } from "@/components/form-show/Inputs";
import dayjs from "dayjs";
import { ExecuteButton } from "../ActionButtons";
import { DialogProps } from "@mui/material";

interface CmsDialogProps extends DialogProps {
  date: Date | null;
  setDate: (value: Date | null) => void;
  onExecuteClick?: () => void;
}

const DateDialog = ({date, setDate, onExecuteClick, ...restProps}: CmsDialogProps) => {

  const PeriodeForm = () => (
    <>
      <MuiDateTimePicker
        name="date"
        label='Date'
        value={dayjs(date)}
        onChange={(date) => setDate(date ? date.toDate() : null)}
        mode={"Edit"}
        onClear={() => setDate(null)}
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

export default DateDialog;