"use client";

import {
  Empty_Periode,
  PERIODE_FETCH_URL,
  PERIODE_TABLE_NAME,
  periode_Schema,
  Periode_Type,
  periode_Columns,
} from "@/types/periode";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { Mode } from "@/lib/types";
import { useState } from "react";
import { MuiDateTimePicker, MuiPKTextField } from "@/components/form-show/Inputs";
import { useParams, useSearchParams } from "next/navigation";
import dayjs from "dayjs";


const Periode_Show = () => {
  //const { addNotification } = useAppContext();

  const { id } = useParams<{ id: string }>();
  //consoleInfo('Periode_Show idParam: ', id)

  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Periode_Show edit: ', edit)

  const [periode, setPeriode] = useState<Periode_Type>(Empty_Periode);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Periode_Type, string>>>({});

  function validate(periode: Periode_Type) : boolean {    
    const result = periode_Schema.safeParse(periode);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Periode_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const getNewPeriode = () => {
    const newEntity : Periode_Type = Empty_Periode
    return newEntity
  }

  const getDuplicatePeriode = () => {
    const { code, ...rest } : Periode_Type = periode;
    const dupEntity : Periode_Type = { code:'', ...rest}
    //consoleInfo('Periode_Show getDuplicatePeriode dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (periode : Periode_Type, modifiedPeriode : Partial<Periode_Type>) : Partial<Periode_Type> => {
    const modifiedWithId={ code: periode.code, ...modifiedPeriode};
    return modifiedWithId
  }

  function setPeriodeValue(name: string, value: any) {
    //consoleInfo('Periode_Show setPeriodeValue name/value ', name, '/', value)
    setPeriode((prevPeriode) => ({
      ...prevPeriode,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPeriodeValue(name, value);
  };
	

  return (
    <GenericShowPage<Periode_Type>
      tableName={ PERIODE_TABLE_NAME }
      columns={periode_Columns}
			apiUrl={ PERIODE_FETCH_URL}
      entityId={id}
      isEditMode={edit}
      setRemoteMode={setMode}
      setEditedEntity={ setPeriode }
      getDisplayName={(periode: Periode_Type) => 'Periode '+periode. code}
      getId={(periode: Periode_Type) =>  periode.code }
      getEditedEntity={() => periode }
      getNewEntity={getNewPeriode }
      getDuplicateEntity={getDuplicatePeriode }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <MuiPKTextField
            name="code"
            label="Code"
            value={ periode.code }
            fullWidth
            mode={mode}
            error={!!errors.code }
            helperText={errors.code }
            onChange={handleChange}
            onClear={() => setPeriodeValue("code", "")} 
          />
          <MuiDateTimePicker
            name="date_deb"
            label='Date début'
            value={dayjs(periode.date_deb)}
            onChange={(date) => setPeriodeValue('date_deb', date ? date.toISOString() : null)}
            onClear={() => setPeriodeValue("date_deb", "")} 
            error={!!errors.date_deb }
            helperText={errors.date_deb }
            mode={mode}
            format="DD/MM/YYYY"
          />
          <MuiDateTimePicker
            name="date_fin"
            label='Date fin'
            value={dayjs(periode.date_fin)}
            onChange={(date) => setPeriodeValue('date_fin', date ? date.toISOString() : null)}
            onClear={() => setPeriodeValue("date_fin", "")} 
            error={!!errors.date_fin }
            helperText={errors.date_fin }
            mode={mode}
            format="DD/MM/YYYY"
          />
        </>
      }
    />
  );
};

export default Periode_Show;