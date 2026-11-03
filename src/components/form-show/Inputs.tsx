import { Mode } from "@/lib/types";
import { Checkbox, CheckboxProps, FormControl, FormHelperText, IconButton, InputLabel, Select, SelectProps, StandardTextFieldProps, SwitchProps, TextField } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import ClearIcon from '@mui/icons-material/Clear';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker, MobileDateTimePickerProps } from '@mui/x-date-pickers/MobileDateTimePicker';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useState } from "react";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { Switch, FormControlLabel } from '@mui/material'
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { formatNumber } from "@/lib/number-utils";

dayjs.extend(localizedFormat);
dayjs.locale('fr');

export const BasicTextField = (props: StandardTextFieldProps) => {
  return  (
    <TextField {...props} 
      variant="outlined"
      slotProps={{ inputLabel: { shrink: true } }}
      sx={{ pl: 1, pr: 1, pt: 1, pb: 2 }}
    />
  )
}

export const renderLockEndAdornment = (mode: Mode, modes: Mode[]) => {
  if (modes.includes(mode)) {
    return (
      <IconButton size="small" sx={{ p: 0 }}>
        <LockIcon fontSize="small" />
      </IconButton>
    );
  }

  return (
    <></>
  );
};

export const renderClearEndAdornment = (mode: Mode, modes: Mode[], onClick: () => void) => {
  if (modes.includes(mode)) {
    return (
    <IconButton onClick={onClick} size="small" sx={{ p: 0 }}>
      <ClearIcon fontSize="small"/>
    </IconButton>
    );
  }

  return (
    <></>
  );
};

export const renderFollowEndAdornment = (mode: Mode, modes: Mode[], onClick: () => void) => {
  if (modes.includes(mode)) {
    return (
    <IconButton onClick={onClick} size="small" sx={{ p: 0 }}>
      <OpenInNewIcon fontSize="small"/>
    </IconButton>
    );
  }

  return (
    <></>
  );
};

export const renderListEndAdornment = (mode: Mode, modes: Mode[], onClick: () => void) => {
  if (modes.includes(mode)) {
    return (
    <IconButton onClick={onClick} size="small" sx={{ p: 0 }}>
      <FormatListBulletedIcon fontSize="small"/>
    </IconButton>
    );
  }

  return (
    <></>
  );
};

export const renderCalendarEndAdornment = (mode: Mode, modes: Mode[], onClick: () => void) => {
  if (modes.includes(mode)) {
    return (
    <IconButton onClick={onClick} size="small" sx={{ p: 0 }}>
      <CalendarTodayIcon fontSize="small"/>
    </IconButton>
    );
  }

  return (
    <></>
  );
};

export interface MuiTextFieldProps extends StandardTextFieldProps {
  mode: Mode;
  onClear?: () => void;
  formatter?: (value: unknown) => string;
}

export const MuiPKTextField = ({
  mode,
  onClear,
  formatter,
  value,
  ...restProps
}: MuiTextFieldProps) => {
  const displayValue =
    formatter && (mode === "Browse" || mode === "Edit")
      ? formatter(value)
      : value;

  return (
    <BasicTextField
      {...restProps}
      value={displayValue}
      disabled={mode === "Browse" || mode === "Edit"}
      slotProps={{
        input: {
          endAdornment: (
            <>
              {renderLockEndAdornment(mode, ["Browse", "Edit"])}
              {typeof onClear === "function" &&
                renderClearEndAdornment(mode, ["Create"], onClear)}
            </>
          ),
        },
      }}
    />
  );
};

export const MuiTextField = ({ mode, onClear, formatter, value, ...restProps }: MuiTextFieldProps) => {
  const displayValue =
    formatter && (mode === "Browse")
      ? formatter(value)
      : value;

  return  (
    <BasicTextField {...restProps} 
      value={displayValue}
      disabled={mode==="Browse"}
      slotProps={{
        input: {
          endAdornment: (
            <>
              {renderLockEndAdornment(mode, ["Browse"])}
              {typeof onClear === "function" && renderClearEndAdornment(mode, ["Create", "Edit"], onClear)}
            </>
          ),
        },
      }}
    />
  );
};

export const numberFormatter = (fractionDigits = 0) => (value: unknown): string => {
  return formatNumber(Number(value), fractionDigits);
};

export interface MuiNumberFieldProps extends MuiTextFieldProps {
  fractionDigits?: number;
}

export const MuiPKNumberField = ({ fractionDigits = 0, ...restProps }: MuiNumberFieldProps) => (
  <MuiPKTextField {...restProps}
    formatter={numberFormatter(fractionDigits)}
  />
);

export const MuiNumberField = ({ fractionDigits = 0, ...restProps }: MuiNumberFieldProps) => (
  <MuiTextField {...restProps}
    formatter={numberFormatter(fractionDigits)}
  />
);

export const SearchTextField = ({ onClear, ...restProps }: MuiTextFieldProps) => {
  return (
    <TextField {...restProps}
      variant="outlined"
      size="small"
      placeholder="Chercher..."
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small"/>
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton onClick={() => onClear ? onClear() : null} size="small">
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }
      }}
    />
  );
};

export const dateFormatter = (format = "DD/MM/YYYY HH:mm:ss") => (value: unknown): string => {
  if (!value) return "";
  const d = dayjs(value as string | Date);
  return d.isValid() ? d.format(format) : String(value);
};

export interface MuiDateFieldProps extends MuiTextFieldProps {
  dateFormat?: string;
}
export const MuiDateField = ({ dateFormat, ...restProps }: MuiDateFieldProps) => (
  <MuiTextField {...restProps} 
    formatter={dateFormatter(dateFormat)}
  />
);

interface MuiDatePickerProps extends MobileDateTimePickerProps {
  value: PickerValue | null;
  mode: Mode;
  error?: boolean;
  helperText?: React.ReactNode;
  onChange: (date: PickerValue | null) => void;
  onClear: () => void;
}

export const MuiDateTimePicker = ({ name, label, value, mode, error, helperText, onClear, onChange, ...restProps }: MuiDatePickerProps) => {
  const isDisabled = mode==="Browse"
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true)
  }

  dayjs.extend(utc);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDateTimePicker {...restProps}
        label={label}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onChange={(newValue) =>
          onChange(newValue ? dayjs.utc(newValue) : null)
        }
        slotProps={{
          textField: {
            fullWidth: true,
            variant: 'outlined',
            size: 'small',
            disabled: isDisabled,
            error,
            helperText,
            slotProps: {
              input: {
                endAdornment: (
                  <>
                    {renderLockEndAdornment(mode, ["Browse"])}
                    {renderClearEndAdornment(mode, ["Create", "Edit"], onClear)}
                    {renderCalendarEndAdornment(mode, ["Create", "Edit"], handleOpen)}
                  </>
                ),
              },
            },
          },
        }}
        sx={{ pl: 1, pr: 1, pt: 1, pb: 2 }}
        value={value ? dayjs.utc(value) : null}
      />
    </LocalizationProvider>
  )
}

export const booleanFormatter = (trueLabel = "Yes", falseLabel = "No") => (value: unknown): string => {
  if (value == null || value === "") return "";
  return Boolean(value) ? trueLabel : falseLabel;
};

export interface MuiBooleanFieldProps extends MuiTextFieldProps {
  trueLabel?: string;
  falseLabel?: string;
}
export const MuiBooleanField = ({ trueLabel, falseLabel, ...restProps }: MuiBooleanFieldProps) => (
  <MuiTextField {...restProps}
    formatter={booleanFormatter(trueLabel, falseLabel)}
  />
);

export interface MuiSwitchProps extends SwitchProps {
  label: string;
  mode: Mode;
  error?: boolean;
  helperText?: string;
}

export const MuiSwitch = ({ label, mode, error, helperText, ...restProps }: MuiSwitchProps) => {
  
return (
    <FormControl
      error={error}
      sx={{ pl: 1, pr: 1, pt: 1, pb: 2 }}
    >
      <FormControlLabel
        control={
          <Switch
            {...restProps}
            disabled={mode === "Browse"}
          />
        }
        label={label}
      />
      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}

export interface MuiCheckboxProps extends CheckboxProps {
  label: string;
  mode: Mode;
  error?: boolean;
  helperText?: string;
}

export const MuiCheckbox = ({ label, mode, error, helperText, ...restProps }: MuiCheckboxProps) => {
  
return (
    <FormControl
      error={error}
      sx={{ pl: 1, pr: 1, pt: 1, pb: 2 }}
    >
      <FormControlLabel
        control={
          <Checkbox
            {...restProps}
            disabled={mode === "Browse"}
          />
        }
        label={label}
      />
      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}

export type MuiSelectProps = SelectProps & {
  label: string;
  mode: Mode;
  error?: boolean;
  helperText?: string;
};

export const MuiSelect = ({ label, mode, error, helperText, ...restProps }: MuiSelectProps) => {
  
  return (
    <FormControl error={error} sx={{ px: 1, pt: 1, pb: 2 }} fullWidth>
      <InputLabel>{label}</InputLabel>

      <Select
        {...restProps}
        label={label}
        disabled={mode === "Browse"}
      />

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}