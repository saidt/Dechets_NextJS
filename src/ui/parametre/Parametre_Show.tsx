"use client";

import { Empty_Parametre, PARAMETRE_FETCH_URL, PARAMETRE_TABLE_NAME, parametre_Schema, Parametre_Type, parametre_Columns } from "@/types/parametre";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { Mode } from "@/lib/types";
import { useState } from "react";
import { MuiPKTextField, MuiTextField } from "@/components/form-show/Inputs";
import { useParams, useSearchParams } from "next/navigation";
import { Divider } from "@mui/material";
import Parametre_Ligne_List from "./Parametre_Ligne_List";

// Declared at module level (not inside Parametre_Show) so each keeps the same
// component identity across re-renders: a component declared inside another
// one is a new type on every render, which remounts it (list reloaded, state
// lost) and, on an API error, re-notifies in an endless loop.
// Per-render values (filters) are passed through ReferenceField dataTableProps.
const Parametre_Ligne_Child = () => (
  <Parametre_Ligne_List isModalList={false} />
);

const Parametre_Show = () => {
  //const { addNotification } = useAppContext();

  const { id } = useParams<{ id: string }>();
  //consoleInfo('Parametre_Show id param: ', id)

  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Parametre_Show edit: ', edit)

  const [parametre, setParametre] = useState<Parametre_Type>(Empty_Parametre);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Parametre_Type, string>>>({});

  function validate(parametre: Parametre_Type) : boolean {    
    const result = parametre_Schema.safeParse(parametre);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Parametre_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const getNewParametre = () => {
    const newEntity : Parametre_Type = Empty_Parametre
    return newEntity
  }

  const getDuplicateParametre = () => {
    const { rubrique, ...rest } : Parametre_Type = parametre;
    const dupEntity : Parametre_Type = { rubrique:'', ...rest}
    //consoleInfo('Parametre_Show getDuplicateParametre dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (parametre : Parametre_Type, modifiedParametre : Partial<Parametre_Type>) : Partial<Parametre_Type> => {
    const modifiedWithId={ rubrique: parametre.rubrique, ...modifiedParametre };
    return modifiedWithId
  }

  function setParametreValue(name: string, value: any) {
    //consoleInfo('Parametre_Show setParametreValue name/value ', name, '/', value)
    setParametre((prevParametre) => ({
      ...prevParametre,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setParametreValue(name, value);
  };
	

  return (
    <GenericShowPage<Parametre_Type>
      tableName={ PARAMETRE_TABLE_NAME }
      columns={parametre_Columns}
			apiUrl={ PARAMETRE_FETCH_URL}
      entityId={id}
      isEditMode={edit}
      setRemoteMode={setMode}
      setEditedEntity={ setParametre }
      getDisplayName={(parametre: Parametre_Type) => 'Paramètre '+parametre. rubrique }
      getId={(parametre: Parametre_Type) =>  parametre.rubrique }
      getEditedEntity={() => parametre }
      getNewEntity={getNewParametre }
      getDuplicateEntity={getDuplicateParametre }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <MuiPKTextField
            name="rubrique"
            label="Rubrique"
            value={ parametre.rubrique }
            fullWidth
            mode={mode}
            error={!!errors.rubrique }
            helperText={errors.rubrique }
            onChange={handleChange}
            onClear={() => setParametreValue("rubrique", "")} 
          />
          <MuiTextField
            name="designation"
            label="Désignation"
            value={ parametre.designation }
            fullWidth
            mode={mode}
            error={!!errors.designation }
            helperText={errors.designation }
            onChange={handleChange}
            onClear={() => setParametreValue("designation", "")}
          />
          <Divider />
          <Parametre_Ligne_Child />
        </>
      }
    />
  );
};

export default Parametre_Show;