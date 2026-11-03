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

const firstDayOfMonth = dayjs().startOf('month');
const lastDayOfMonth = dayjs().endOf('month');

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

    return {
      date: result.data[0].RET_VALUE,
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
      date: firstDayOfMonth.toDate(),
      error: result.error,
    };
  }
  return result
}

export async function fetchDateFin(): Promise<DateResultType> {
  const result : DateResultType= await fetchDate('dbo.d_DATE_FIN_PERIODE');
  if (result.error) {
    return {
      date: lastDayOfMonth.toDate(),
      error: result.error,
    };
  }
  return result
}

export async function fetchPeriode(): Promise<PeriodeResultType> {
  try {
    const [resultDeb, resultFin] = await Promise.all([
      fetchDateDeb(),
      fetchDateFin(),
    ]);

    if (resultDeb.error) {
      return {
        dateDeb: lastDayOfMonth.toDate(),
        dateFin: lastDayOfMonth.toDate(),
        error: resultDeb.error,
      };
    }

    if (resultFin.error) {
      return {
        dateDeb: lastDayOfMonth.toDate(),
        dateFin: lastDayOfMonth.toDate(),
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
      dateDeb: lastDayOfMonth.toDate(),
      dateFin: lastDayOfMonth.toDate(),
      error: err instanceof Error ? err.message : 'fetchPeriode error',
    };
  }
}