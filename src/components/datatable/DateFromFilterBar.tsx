"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { MuiDatePicker } from "@/components/form-show/Inputs";
import { useAppContext } from "@/app/context/AppContext";
import { fetchPeriode } from "@/lib/periode";
import { Filter } from "@/lib/types";

dayjs.extend(utc);

type DateFromFilterBarProps = {
  label: string;
  date: Date | null;
  onChange: (date: Date | null) => void;
};

/** "Date pièce : [date]" bar shown below a list's toolbar (GenericListPage filterBar). */
export const DateFromFilterBar = ({ label, date, onChange }: DateFromFilterBarProps) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1, pt: 1 }}>
    <Typography variant="body1" sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
      {label} :
    </Typography>
    <Box sx={{ width: 220 }}>
      <MuiDatePicker
        name="dateFromFilter"
        label="À partir du"
        mode="Edit"
        value={date ? dayjs.utc(date) : null}
        onChange={(d) => onChange(d ? dayjs.utc(d).startOf("day").toDate() : null)}
        onClear={() => onChange(null)}
      />
    </Box>
  </Box>
);

/**
 * A "from date" filter on a list's date column (e.g. date_piece), with its bar.
 * Starts at the period's start date (fetchPeriode) minus one month, in UTC like the
 * date pickers. Returns the bar to pass as filterBar and the filter to pass as
 * initialFilter; clearing the date removes the filter. `ready` is false while the
 * period is loading, so the list can wait instead of loading everything first.
 * When `enabled` is false (pick-lists), nothing is loaded and no filter is set.
 */
export function useDateFromFilter<T>(field: keyof T, label: string, enabled = true) {
  const { addNotification } = useAppContext();
  // undefined = not loaded yet; null = cleared by the user
  const [date, setDate] = useState<Date | null | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetchPeriode().then((result) => {
      if (cancelled) return;
      // On error fetchPeriode returns the current month: still usable, and the error is shown
      if (result.error) addNotification(result.error, "error");
      const start = result.dateDeb ?? new Date();
      setDate(dayjs.utc(start).subtract(1, "month").startOf("day").toDate());
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const initialFilter = useMemo<Filter<T> | undefined>(() => {
    if (!enabled || date === undefined) return undefined;
    // An empty value removes the filter (removeEmptyValues)
    const value = date ? { value: dayjs.utc(date).format("DD/MM/YYYY"), fromFilter: true } : "";
    return { [field]: value } as Filter<T>;
  }, [enabled, date, field]);

  const filterBar = enabled && date !== undefined
    ? <DateFromFilterBar label={label} date={date} onChange={setDate} />
    : undefined;

  return { ready: !enabled || date !== undefined, initialFilter, filterBar };
}
