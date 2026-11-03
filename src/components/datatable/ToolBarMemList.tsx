import { Box, Toolbar } from "@mui/material";
import { ExportButton, PrintButton, RefreshButton } from "../ui/ActionButtons";
import { SearchTextField } from "../form-show/Inputs";
import OptionsMenu from "../ui/menu/OptionsMenu";

interface ToolbarMemListProps {
  quickSearch: string;
  isModalList: boolean;
  optionsMenu?: React.ReactNode[];
  onQuickSearchChange: (value: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onPrint?: () => void;
}

function ToolbarMemList({
  quickSearch,
  isModalList,
  optionsMenu,
  onQuickSearchChange,
  onRefresh,
  onExport,
  onPrint,
} : ToolbarMemListProps) {
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
        {!isModalList && onExport && <ExportButton onClick={onExport} />}
        {!isModalList && onPrint && <PrintButton onClick={onPrint} />}

        {optionsMenu && optionsMenu.length > 0 && <OptionsMenu optionsMenu={optionsMenu} />}

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

export default ToolbarMemList;