"use client";

import {
  Empty_Pesee,
  pesee_Columns,
  PESEE_FETCH_URL,
  PESEE_SHOW_TITLE,
  PESEE_TABLE_NAME,
  pesee_Schema,
  Pesee_Type 
} from "@/types/pesee";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { Mode } from "@/lib/types";
import { useState } from "react";
import { MuiDateTimePicker, MuiNumberField, MuiPKTextField, MuiTextField } from "@/components/form-show/Inputs";
import { useParams, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
//import { isDevMode } from "@/lib/lib";

const Pesee_Show = () => {
  //const { addNotification } = useAppContext();


  const { id } = useParams<{ id: string }>();
  //isDevMode() && console.log('Pesee_Show idParam: ', id)
  
  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //isDevMode() && console.log('Pesee_Show edit: ', edit)

  const [pesee, set_Pesee] = useState<Pesee_Type>(Empty_Pesee);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Pesee_Type, string>>>({});

  function validate(pesee: Pesee_Type) : boolean {    
    const result = pesee_Schema.safeParse(pesee);
    //isDevMode() && console.log('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //isDevMode() && console.log('Pesee_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const get_New_Pesee = () => {
    const newEntity : Pesee_Type = Empty_Pesee
    return newEntity
  }

  const get_Duplicate_Pesee = () => {
    const { numero_1, ...rest } : Pesee_Type = pesee;
    const dupEntity : Pesee_Type = { numero_1:'', ...rest}
    //isDevMode() && console.log('Pesee_Show getDuplicatePesee dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (pesee : Pesee_Type, modifiedPesee : Partial<Pesee_Type>) : Partial<Pesee_Type> => {
    const modifiedWithId={ numero_1: pesee.numero_1, ...modifiedPesee};
    return modifiedWithId
  }

  function set_Pesee_Value(name: string, value: any) {
    //isDevMode() && console.log('Pesee_Show set_Pesee_Value name/value ', name, '/', value)
    set_Pesee((prevPesee) => ({
      ...prevPesee,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_Pesee_Value(name, value);
  };
	
  return (
    <GenericShowPage<Pesee_Type>
      tableName={ PESEE_TABLE_NAME }
	    columns={ pesee_Columns }
      apiUrl={ PESEE_FETCH_URL}
      entityId={id}
      isEditMode={edit}
      setRemoteMode={setMode}
      setEditedEntity={ set_Pesee }
      getDisplayName={(pesee: Pesee_Type) => PESEE_SHOW_TITLE+" "+pesee. numero_1}
      getId={(pesee: Pesee_Type) =>  pesee.numero_1 }
      getEditedEntity={() => pesee }
      getNewEntity={get_New_Pesee }
      getDuplicateEntity={get_Duplicate_Pesee }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <MuiPKTextField
            name="numero_1"
            label="Numéro 1"
            value={ pesee.numero_1 }
            fullWidth
            mode={mode}
            error={!!errors.numero_1 }
            helperText={errors.numero_1 }
            onChange={handleChange}
            onClear={() => set_Pesee_Value("numero_1", "")} 
          />
          <MuiDateTimePicker
            name="date_1"
            label='Date 1'
            value={dayjs(pesee.date_1)}
            onChange={(date) => set_Pesee_Value('date_1', date)}
            mode={mode}
            onClear={() => set_Pesee_Value("date_1", null)}
            error={!!errors.date_1 }
            helperText={errors.date_1 }
            format="DD/MM/YYYY"
          />
          <MuiTextField
            name="heure_1"
            label="Heure 1"
            value={ pesee.heure_1 }
            fullWidth
            mode={mode}
            error={!!errors.heure_1 }
            helperText={errors.heure_1 }
            onChange={handleChange}
            onClear={() => set_Pesee_Value("heure_1", "")}
          />
          <MuiTextField
            name="numero_2"
            label="Numéro 2"
            value={ pesee.numero_2 }
            fullWidth
            mode={mode}
            error={!!errors.numero_2 }
            helperText={errors.numero_2 }
            onChange={handleChange}
            onClear={() => set_Pesee_Value("numero_2", "")}
          />
          <MuiDateTimePicker
            name="date_2"
            label='Date 2'
            value={dayjs(pesee.date_2)}
            onChange={(date) => set_Pesee_Value('date_2', date)}
            mode={mode}
            onClear={() => set_Pesee_Value("date_2", null)}
            error={!!errors.date_2 }
            helperText={errors.date_2 }
            format="DD/MM/YYYY"
          />
          <MuiTextField
            name="heure_2"
            label="Heure 2"
            value={ pesee.heure_2 }
            fullWidth
            mode={mode}
            error={!!errors.heure_2 }
            helperText={errors.heure_2 }
            onChange={handleChange}
            onClear={() => set_Pesee_Value("heure_2", "")}
          />
          <MuiTextField
            name="client_raison_sociale"
            label="Client"
            value={ pesee.client_raison_sociale }
            fullWidth
            mode={mode}
            error={!!errors.client_raison_sociale }
            helperText={errors.client_raison_sociale }
            onChange={handleChange}
            onClear={() => set_Pesee_Value("client_raison_sociale", "")}
          />
          <MuiTextField
            name="frs_raison_sociale"
            label="Fournisseur"
            value={ pesee.frs_raison_sociale }
            fullWidth
            mode={mode}
            error={!!errors.frs_raison_sociale }
            helperText={errors.frs_raison_sociale }
            onChange={handleChange}
            onClear={() => set_Pesee_Value("frs_raison_sociale", "")}
          />
          <MuiTextField
            name="article_designation"
            label="Article"
            value={ pesee.article_designation }
            fullWidth
            mode={mode}
            error={!!errors.article_designation }
            helperText={errors.article_designation }
            onChange={handleChange}
            onClear={() => set_Pesee_Value("article_designation", "")}
          />
          <MuiTextField
            name="immatriculation"
            label="Matricule"
            value={ pesee.immatriculation }
            fullWidth
            mode={mode}
            error={!!errors.immatriculation }
            helperText={errors.immatriculation }
            onChange={handleChange}
            onClear={() => set_Pesee_Value("immatriculation", "")}
          />
          <MuiNumberField
            name="poids_brut"
            label="Poids brut"
            value={ pesee.poids_brut }
            fullWidth
            onChange={handleChange}
            error={!!errors.poids_brut }
            helperText={errors.poids_brut }
            mode={mode}
            onClear={() => set_Pesee_Value('poids_brut', '')}
          />
          <MuiNumberField
            name="tare"
            label="Tare"
            type="number"
            value={ pesee.tare }
            fullWidth
            onChange={handleChange}
            error={!!errors.tare }
            helperText={errors.tare }
            mode={mode}
            onClear={() => set_Pesee_Value('tare', '')}
          />
          <MuiNumberField
            name="poids_net"
            label="Poids net"
            value={ pesee.poids_net }
            fullWidth
            onChange={handleChange}
            error={!!errors.poids_net }
            helperText={errors.poids_net }
            mode={mode}
            onClear={() => set_Pesee_Value('poids_net', '')}
          />
          <MuiTextField
            name="sens"
            label="Sens"
            value={ pesee.sens }
            fullWidth
            mode={mode}
            error={!!errors.sens }
            helperText={errors.sens }
            onChange={handleChange}
            onClear={() => set_Pesee_Value("sens", "")}
          />
        </>
      }
    />
  );
};

export default Pesee_Show;