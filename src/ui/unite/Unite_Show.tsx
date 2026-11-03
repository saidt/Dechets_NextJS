"use client";

import { Empty_Unite, UNITE_FETCH_URL, UNITE_TABLE_NAME, UNITE_URL, unite_Schema, Unite_Type, unite_Columns } from "@/types/unite";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { Mode } from "@/lib/types";
import { useState } from "react";
import { MuiPKTextField, MuiTextField } from "@/components/form-show/Inputs";
import { useParams, useSearchParams } from "next/navigation";

const UniteShowPage = () => {
  //const { addNotification } = useAppContext();

  const { id } = useParams<{ id: string }>();
  //consoleInfo('UniteShowPage idParam: ', id)

  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('UniteShowPage edit: ', edit)

  const [unite, setUnite] = useState<Unite_Type>(Empty_Unite);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Unite_Type, string>>>({});

  function validate(unite: Unite_Type) : boolean {    
    const result = unite_Schema.safeParse(unite);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const getNewUnite = () => {
    const newEntity : Unite_Type = Empty_Unite
    return newEntity
  }

  const getDuplicateUnite = () => {
    const { code, ...rest } : Unite_Type = unite;
    const dupEntity : Unite_Type = { code:'', ...rest}
    //consoleInfo('getDuplicateUnite dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (unite : Unite_Type, modifiedUnite : Partial<Unite_Type>) : Partial<Unite_Type> => {
    const modifiedWithId={ code: unite.code, ...modifiedUnite};
    return modifiedWithId
  }

  function setUniteValue(name: string, value: any) {
    //consoleInfo('setUniteValue name/value ', name, '/', value)
    setUnite((prevUnite) => ({
      ...prevUnite,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUniteValue(name, value);
  };

  return (
    <GenericShowPage<Unite_Type>
      tableName={ UNITE_TABLE_NAME }
      columns={unite_Columns}
			apiUrl={ UNITE_FETCH_URL}
      entityId={id}
      isEditMode={edit}
      setRemoteMode={setMode}
      setEditedEntity={ setUnite }
      getDisplayName={(unite: Unite_Type) => 'Unité '+unite.code}
      getId={(unite: Unite_Type) =>  unite.code }
      getEditedEntity={() => unite }
      getNewEntity={getNewUnite }
      getDuplicateEntity={getDuplicateUnite }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <MuiPKTextField
            name="code"
            label="Unité"
            value={ unite.code }
            fullWidth
            mode={mode}
            error={!!errors.code }
            helperText={errors.code }
            onChange={handleChange}
            onClear={() => setUniteValue("code", "")} 
          />
          <MuiTextField
            name="designation"
            label="Désignation"
            value={ unite.designation }
            fullWidth
            mode={mode}
            error={!!errors.designation }
            helperText={errors.designation }
            onChange={handleChange}
            onClear={() => setUniteValue("designation", "")}
          />
        </>
      }
    />
  );
};

export default UniteShowPage;