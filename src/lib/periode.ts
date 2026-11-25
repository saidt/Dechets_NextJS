import { Scalar_Function_Param_Type } from "@/types/sp";
import { fetchScalarFunction } from "./fetchData";
import dayjs from "dayjs";

export type DateResultType = {
  date: Date | null;
  error: string | null;
};

export type PeriodeResultType = {
  dateDeb: Date | null;
  dateFin: Date | null;
  error: string | null;
};

// Fallback when the period can't be read: the current month (1st 00:00:00 to
// last day 23:59:59); the error is still returned so the screen shows it.
// Computed at each call (not at module load, which would keep the month the
// page was first opened in).
const startOfMonth = (): Date => dayjs().startOf('month').toDate();
const endOfMonth = (): Date => dayjs().endOf('month').toDate();

async function fetchDate(scalarFunctionName: string): Promise<DateResultType> {
  try {
    const params : Scalar_Function_Param_Type[] = []
    const response = await fetchScalarFunction(scalarFunctionName, params);
    const result = await response.json();
  
    if (result.error) {
      return {
        date: new Date(),
        error: result.error,
      };
    }

    // JSON has no date type: the function's value arrives as an ISO string
    const value = result.data;
    const date = value ? new Date(value) : null;
    if (!date || isNaN(date.getTime())) {
      return {
        date: new Date(),
        error: `${scalarFunctionName}: date invalide (${value ?? 'vide'})`,
      };
    }

    return {
      date,
      error: null,
    };
  } 
  catch (err) {
    return {
      date: new Date(),
      error: err instanceof Error ? err.message : 'fetchDate error',
    };
  }
}

export async function fetchDateDeb(): Promise<DateResultType> {
  const result : DateResultType= await fetchDate('dbo.d_DATE_DEBUT_PERIODE');
  if (result.error) {
    return {
      date: startOfMonth(),
      error: result.error,
    };
  }
  return result
}

export async function fetchDateFin(): Promise<DateResultType> {
  const result : DateResultType= await fetchDate('dbo.d_DATE_FIN_PERIODE');
  if (result.error) {
    return {
      date: endOfMonth(),
      error: result.error,
    };
  }
  return result
}

/** The period's start and end dates. On error: the current month, with the error message. */
export async function fetchPeriode(): Promise<PeriodeResultType> {
  try {
    const [resultDeb, resultFin] = await Promise.all([
      fetchDateDeb(),
      fetchDateFin(),
    ]);

    if (resultDeb.error) {
      return {
        dateDeb: startOfMonth(),
        dateFin: endOfMonth(),
        error: resultDeb.error,
      };
    }

    if (resultFin.error) {
      return {
        dateDeb: startOfMonth(),
        dateFin: endOfMonth(),
        error: resultFin.error,
      };
    }

    return {
      dateDeb: resultDeb.date,
      dateFin: resultFin.date,
      error: null,
    };
  } 
  catch (err) {
    return {
      dateDeb: startOfMonth(),
      dateFin: endOfMonth(),
      error: err instanceof Error ? err.message : 'fetchPeriode error',
    };
  }
}