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

type DateFormProps = {
  date: Date | null;
  setDate: (value: Date | null) => void;
  onExecuteClick?: () => void;
};

// Module level: a component declared inside DateDialog would be a new type on
// every re-render, remounting the picker and losing what the user is typing.
const DateForm = ({ date, setDate, onExecuteClick }: DateFormProps) => (
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

const DateDialog = ({date, setDate, onExecuteClick, ...restProps}: CmsDialogProps) => {

  return (
    <MuiDialog {...restProps}
      title="Période"
      children={<DateForm date={date} setDate={setDate} onExecuteClick={onExecuteClick} />}
      maxWidth={"xs"}
    />
  );
};

export default DateDialog;