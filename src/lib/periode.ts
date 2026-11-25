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

// Fallback when the period can't be read: today to today, so the user sees at
// once that something is wrong with the period. Computed at each call (not at
// module load, which would keep the day the page was first opened).
const startOfToday = (): Date => dayjs().startOf('day').toDate();
const endOfToday = (): Date => dayjs().endOf('day').toDate();

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
      date: startOfToday(),
      error: result.error,
    };
  }
  return result
}

export async function fetchDateFin(): Promise<DateResultType> {
  const result : DateResultType= await fetchDate('dbo.d_DATE_FIN_PERIODE');
  if (result.error) {
    return {
      date: endOfToday(),
      error: result.error,
    };
  }
  return result
}

/** The period's start and end dates. On error: today to today, with the error message. */
export async function fetchPeriode(): Promise<PeriodeResultType> {
  try {
    const [resultDeb, resultFin] = await Promise.all([
      fetchDateDeb(),
      fetchDateFin(),
    ]);

    if (resultDeb.error) {
      return {
        dateDeb: startOfToday(),
        dateFin: endOfToday(),
        error: resultDeb.error,
      };
    }

    if (resultFin.error) {
      return {
        dateDeb: startOfToday(),
        dateFin: endOfToday(),
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
      dateDeb: startOfToday(),
      dateFin: endOfToday(),
      error: err instanceof Error ? err.message : 'fetchPeriode error',
    };
  }
}