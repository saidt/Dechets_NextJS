import { Box, Toolbar, Divider } from "@mui/material";
import {
  ExportButton,
  NewButton,
  PrintButton,
  RefreshButton,
} from "../ui/ActionButtons";
import DataTableMenu from "./DataTableMenu";
import { Filter } from "@/lib/types";
import { SearchTextField } from "../form-show/Inputs";
import useAuth from "@/app/context/UseAuth";

interface ToolbarListProps<T extends Record<string, any>> {
  quickSearch: string;
  isModalList: boolean;
  lastViewedId: string | number | null;
  lastViewedPath: string;
  tableName: string;
  filter: Filter<T>;
  optionsMenu?: React.ReactNode[];
  onQuickSearchChange: (value: string) => void;
  onRefresh?: () => void;
  onSaveView?: () => void;
  onExport?: () => void;
  onPrint?: () => void;
  onNew?: () => void;
  onSaveContext: () => void;
  onReadContext: () => void;
  onSaveFilter: (filterName: string) => void;
  onLoadFilter: (filter: Filter<T>) => void;
}

function ToolbarList<T extends Record<string, any>>({
  quickSearch,
  isModalList,
  lastViewedId,
  lastViewedPath,
  tableName,
  filter,
  optionsMenu,
  onQuickSearchChange,
  onRefresh,
  onExport,
  onPrint,
  onNew,
  onSaveContext,
  onReadContext,
  onSaveFilter,
  onLoadFilter,
} : ToolbarListProps<T>) {
  
  const { hasRole } = useAuth();

  const canExport = hasRole(tableName+'.EXPORT')
  const canPrint = hasRole(tableName+'.PRINT')
  const canAdd = hasRole(tableName+'.ADD')

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
      <Box
        sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}
      >
        <RefreshButton onClick={onRefresh} />
        {!isModalList && onExport && canExport && <ExportButton onClick={onExport} />}
        {!isModalList && onPrint && canPrint && <PrintButton onClick={onPrint} />}
        {!isModalList && onNew && canAdd && <NewButton onClick={onNew} />}
                
        <Divider />

        <DataTableMenu
          lastViewedId={lastViewedId}
          lastViewedPath={lastViewedPath}
          isModalList={isModalList}
          onSaveContext={onSaveContext}
          onReadContext={onReadContext}
          onSaveFilter={onSaveFilter}
          onLoadFilter={onLoadFilter}
          tableName={tableName}
          filter={filter}
          optionsMenu={optionsMenu}
        />

        <SearchTextField
          value={quickSearch}
          onChange={(e) => onQuickSearchChange(e.target.value)}
          onClear={() => onQuickSearchChange('')}
          mode="Browse"
        />
      </Box>
    </Toolbar>
  );
};

export default ToolbarList;