import * as React from "react";
import { Breakpoint } from "@mui/material";
import {
  BasicTextField,
  MuiTextFieldProps,
  renderClearEndAdornment,
  renderFollowEndAdornment,
  renderListEndAdornment,
  renderLockEndAdornment,
} from "./Inputs";
import { useRouter } from "next/navigation";
import MuiDialog from "../ui/dialog/MuiDialog";

interface ReferenceFieldProps extends MuiTextFieldProps {
  fieldName: string;
  setValue: (value: any) => void;
  onClear: () => void;
  maxWidth?: Breakpoint;
  DataTableComponent: React.ComponentType<any>;
  // Extra props for DataTableComponent (e.g. initialFilter, permanentFilter).
  // Pass a module-level DataTableComponent and put per-render values here,
  // so the list keeps its identity and is not remounted on every re-render.
  dataTableProps?: Record<string, any>;
  followUrl?: string;
  isPK?: boolean;
  forceOpen?: boolean;
}

export function ReferenceField<T extends Record<string, any>>({
  fieldName,
  setValue,
  DataTableComponent,
  dataTableProps,
  followUrl,
  isPK,
  forceOpen,
  ...restProps
}: ReferenceFieldProps) {
  const [open, setOpen] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    if (forceOpen === true) {
      setOpen(true);
    }
  }, [forceOpen]);

  const handleRowClick = (row: T) => {
    const value = row[fieldName];
    //consoleInfo('ReferenceField handleRowClick value: ', value)
    setValue(value);
    setOpen(false);
  };

  const handleFollowClick = () => {
    if (followUrl) {
      router.push(followUrl);
    }
  };

  const handleListClick = () => {
    setOpen(true);
  };

  return (
    <>
      <BasicTextField
        {...restProps}
        disabled={
          isPK
            ? restProps.mode === "Browse" || restProps.mode === "Edit"
            : restProps.mode === "Browse"
        }
        slotProps={{
          input: {
            endAdornment: (
              <>
                {renderLockEndAdornment(restProps.mode, ["Browse"])}
                {renderClearEndAdornment(
                  restProps.mode,
                  ["Edit"],
                  restProps.onClear,
                )}
                {followUrl &&
                  renderFollowEndAdornment(
                    restProps.mode,
                    ["Browse"],
                    handleFollowClick,
                  )}
                {renderListEndAdornment(
                  restProps.mode,
                  ["Create", "Edit"],
                  handleListClick,
                )}
              </>
            ),
          },
        }}
      />

      <MuiDialog
        open={open}
        title="Choisir une valeur référence"
        children={<DataTableComponent {...dataTableProps} onRowClick={handleRowClick} />}
      />
    </>
  );
}
