"use client";

import { Empty_Parametre_Ligne, PARAMETRE_LIGNE_CHILD_URL, PARAMETRE_LIGNE_TABLE_NAME, parametre_Ligne_Schema, Parametre_Ligne_Type, parametre_Ligne_Columns } from "@/types/parametre-ligne";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { Mode } from "@/lib/types";
import { useState } from "react";
import { MuiPKNumberField, MuiPKTextField, MuiTextField } from "@/components/form-show/Inputs";
import { useParams, useSearchParams } from "next/navigation";
import { PARAMETRE_FETCH_URL } from "@/types/parametre";

const Parametre_Ligne_Show = () => {
  //const { addNotification } = useAppContext();

  const { id, childId } = useParams<{ id: string; childId: string }>();

  //consoleInfo('Parametre_Ligne_Show masterId Param: ', masterId)
  //consoleInfo('Parametre_Ligne_Show childId Param: ', childId)

  // Copy: modifying Empty_Parametre_Ligne itself would change the shared object used everywhere
  const empty_Parametre_Ligne : Parametre_Ligne_Type = { ...Empty_Parametre_Ligne, parametre_rubrique: id };

  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Parametre_Ligne_Show edit: ', edit)

  const [parametre_Ligne, setParametre_Ligne] = useState<Parametre_Ligne_Type>(Empty_Parametre_Ligne);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Parametre_Ligne_Type, string>>>({});

  function validate(parametre_Ligne: Parametre_Ligne_Type) : boolean {    
    const result = parametre_Ligne_Schema.safeParse(parametre_Ligne);
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

  const getNewParametre_Ligne = () => {
    const newEntity : Parametre_Ligne_Type = { ...empty_Parametre_Ligne }
    return newEntity
  }

  const getDuplicateParametre_Ligne = () => {
    const { id, ...rest } : Parametre_Ligne_Type = parametre_Ligne;
    const dupEntity : Parametre_Ligne_Type = { id:0, ...rest}
    //consoleInfo('getDuplicateParametre_Ligne dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (parametre_Ligne : Parametre_Ligne_Type, modifiedParametre_Ligne : Partial<Parametre_Ligne_Type>) : Partial<Parametre_Ligne_Type> => {
    const modifiedWithId={ id: parametre_Ligne.id, ...modifiedParametre_Ligne};
    return modifiedWithId
  }

  function setParametre_LigneValue(name: string, value: any) {
    //consoleInfo('setParametre_LigneValue name/value ', name, '/', value)
    setParametre_Ligne((prevParametre_Ligne) => ({
      ...prevParametre_Ligne,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setParametre_LigneValue(name, value);
  };

  return (
    <GenericShowPage<Parametre_Ligne_Type>
      tableName={ PARAMETRE_LIGNE_TABLE_NAME }
      columns={parametre_Ligne_Columns}
      apiUrl={`${ PARAMETRE_FETCH_URL }/${id}/${ PARAMETRE_LIGNE_CHILD_URL }`}
      entityId={childId}
      isEditMode={edit}
      childUrl="ligne"
      setRemoteMode={setMode}
      setEditedEntity={ setParametre_Ligne }
      getDisplayName={(parametre_Ligne: Parametre_Ligne_Type) => 'Paramètre ligne '+parametre_Ligne. id}
      getId={(parametre_Ligne: Parametre_Ligne_Type) =>  parametre_Ligne.id }
      getEditedEntity={() => parametre_Ligne }
      getNewEntity={getNewParametre_Ligne }
      getDuplicateEntity={getDuplicateParametre_Ligne }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <MuiPKNumberField
            name="id"
            label="Id"
            value={ parametre_Ligne.id }
            fullWidth
            mode={"Browse"}
            error={!!errors.id }
            helperText={errors.id }
          />
          <MuiTextField
            name="rubrique"
            label="Rubrique"
            value={ parametre_Ligne.parametre_rubrique }
            fullWidth
            mode={"Browse"}
            error={!!errors.code }
            helperText={errors.code }
          />
          <MuiTextField
            name="code"
            label="Code"
            value={ parametre_Ligne.code }
            fullWidth
            mode={mode}
            error={!!errors.code }
            helperText={errors.code }
            onChange={handleChange}
            onClear={() => setParametre_LigneValue("code", "")}
          />
          <MuiTextField
            name="designation"
            label="Désignation"
            value={ parametre_Ligne.designation }
            fullWidth
            mode={mode}
            error={!!errors.designation }
            helperText={errors.designation }
            onChange={handleChange}
            onClear={() => setParametre_LigneValue("designation", "")}
          />
        </>
      }
    />
  );
};

export default Parametre_Ligne_Show;