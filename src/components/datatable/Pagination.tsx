import React from "react";
import {
  Box,
  IconButton,
  Button,
  Typography,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { DOTS, usePagination } from "../hooks/usePagination";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import CustomSelect from "../forms/theme-elements/CustomSelect";

export interface PaginationProps {
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  totalCount: number;
  currentPage: number; // 1-based index
  pageSize: number;
  siblingCount?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  onPageChange,
  onPageSizeChange,
  totalCount,
  currentPage,
  pageSize,
  siblingCount = 1,
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);
  const onFirst = () => onPageChange(1);
  const onLast = () => onPageChange(Math.ceil(totalCount / pageSize));

  const lastPage = Math.ceil(totalCount / pageSize);

  //consoleInfo('Pagination paginationRange: ', currentPage, lastPage, totalCount, pageSize)

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        px: { xs: 1, sm: 1 },
        py: 1,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body1">{totalCount} Rows</Typography>
      </Box>
      <Stack sx={{ direction: "row", alignItems: "center", gap: 1 }}>
        <Typography variant="body1">Page {currentPage} / {lastPage}</Typography>
      </Stack>
      <Divider sx={{ marginX: 1 }}/>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        Go to page:&nbsp;
        <CustomTextField
          type="number"
          sx={{ width: 80 }}
          value={currentPage}
          slotProps={{ input: { min: 1, max: lastPage } }}
          onChange={(e: { target: { value: any } }) => {
            const page = e.target.value ? Number(e.target.value) : 0;
            if (page >= 1 && page <= lastPage) {
              onPageChange(page);
            }
          }}
        />
      </Stack>
      <Divider sx={{ marginX: 2 }}/>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        Per page:&nbsp;
        <CustomSelect
          labelId="per-page-label"
          value={pageSize}
          onChange={(e: { target: { value: any } }) => {
            onPageSizeChange(Number(e.target.value));
          }}
        >
          {[5, 8, 10, 15, 20, 25].map((pageSize) => (
            <MenuItem key={pageSize} value={pageSize}>
              {pageSize}
            </MenuItem>
          ))}
        </CustomSelect>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <IconButton
          onClick={onFirst}
          disabled={totalCount===0 ||currentPage === 1}
          aria-label="Début"
        >
          <FirstPageIcon />
        </IconButton>
        <IconButton
          onClick={onPrevious}
          disabled={totalCount===0 || currentPage === 1}
          aria-label="Précédent"
        >
          <KeyboardArrowLeft />
        </IconButton>

        {paginationRange?.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <Typography key={DOTS + index} sx={{ px: 1 }}>
                &#8230;
              </Typography>
            );
          }
          return (
            <Button
              key={pageNumber}
              size="small"
              variant={pageNumber === currentPage ? "contained" : "text"}
              onClick={() => onPageChange(pageNumber as number)}
              sx={{ minWidth: "36px", p: "4px" }}
            >
              {pageNumber}
            </Button>
          );
        })}

        <IconButton
          onClick={onNext}
          disabled={totalCount===0 || currentPage === lastPage}
          aria-label="Suivant"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={onLast}
          disabled={totalCount===0 ||currentPage === lastPage}
          aria-label="Fin"
        >
          <LastPageIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Pagination;