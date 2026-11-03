"use client";

import {
  Empty_Versement_Dechet_Ligne,
  VERSEMENT_DECHET_LIGNE_CHILD_URL,
  VERSEMENT_DECHET_LIGNE_TABLE_NAME,
  versement_Dechet_Ligne_Schema,
  Versement_Dechet_Ligne_Type,
  versement_Dechet_Ligne_Columns
} from "@/types/versement-dechet-ligne";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { Mode } from "@/lib/types";
import { useEffect, useState } from "react";
import { MuiDateField, MuiNumberField, MuiPKNumberField, MuiTextField } from "@/components/form-show/Inputs";
import { ReferenceField } from "@/components/form-show/ReferenceField";
import { useParams, useSearchParams } from "next/navigation";
import { getResponseData } from "@/lib/html";
import { Empty_Reglement_Dechet, Reglement_Dechet_Type, REGLEMENT_DECHET_URL } from "@/types/reglement-dechet";
import { VERSEMENT_DECHET_FETCH_URL } from "@/types/versement-dechet"; 
import Reglement_Dechet_Reste_A_Verser, { RdravMemListPageProps } from "../reglement-dechet/Reglement_Dechet_Reste_A_Verser";
import { fetch_Reglement_Dechet } from "@/fetch/reglement-dechet";

const Versement_Dechet_Ligne_Show = () => {
  //const { addNotification } = useAppContext();

  const { id, childId } = useParams<{ id: string; childId: string }>();

  //consoleInfo('Versement_Dechet_Ligne_Show id Param: ', id)
  //consoleInfo('Versement_Dechet_Ligne_Show childId Param: ', childId)

  const empty_Versement_Dechet_Ligne = Empty_Versement_Dechet_Ligne;
  empty_Versement_Dechet_Ligne.versement_dechet_numero = Number(id)
	

  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Versement_Dechet_Ligne_Show edit: ', edit)

  const [versement_Dechet_Ligne, set_Versement_Dechet_Ligne] = useState<Versement_Dechet_Ligne_Type>(Empty_Versement_Dechet_Ligne);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Versement_Dechet_Ligne_Type, string>>>({});
  const [reglement_dechet_numero_forceOpen, set_reglement_dechet_numero_forceOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [reglement_Dechet, set_Reglement_Dechet] = useState<Reglement_Dechet_Type>(Empty_Reglement_Dechet);
  
  function validate(versement_Dechet_Ligne: Versement_Dechet_Ligne_Type) : boolean {    
    const result = versement_Dechet_Ligne_Schema.safeParse(versement_Dechet_Ligne);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Versement_Dechet_Ligne_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const get_New_Versement_Dechet_Ligne = () => {
    const newEntity : Versement_Dechet_Ligne_Type = Empty_Versement_Dechet_Ligne
    return newEntity
  }

  const get_Duplicate_Versement_Dechet_Ligne = () => {
    const { id, ...rest } : Versement_Dechet_Ligne_Type = versement_Dechet_Ligne;
    const dupEntity : Versement_Dechet_Ligne_Type = { id:0, ...rest}
    //consoleInfo('Versement_Dechet_Ligne_Show getDuplicateVersement_Dechet_Ligne dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (versement_Dechet_Ligne : Versement_Dechet_Ligne_Type, modifiedVersement_Dechet_Ligne : Partial<Versement_Dechet_Ligne_Type>) : Partial<Versement_Dechet_Ligne_Type> => {
    const modifiedWithId={ id: versement_Dechet_Ligne.id, ...modifiedVersement_Dechet_Ligne};
    return modifiedWithId
  }

  function set_Versement_Dechet_Ligne_Value(name: string, value: any) {
    //consoleInfo('Versement_Dechet_Ligne_Show set_Versement_Dechet_Ligne_Value name/value ', name, '/', value)
    set_Versement_Dechet_Ligne((prevVersement_Dechet_Ligne) => ({
      ...prevVersement_Dechet_Ligne,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_Versement_Dechet_Ligne_Value(name, value);
  };
	
	const check_reglement_dechet_numero = async(value: number) : Promise<boolean> =>{
    try {
      const response = await fetch_Reglement_Dechet(value)
      const data : Reglement_Dechet_Type = await getResponseData(response, 'check_reglement_dechet_numero api error')
      //consoleInfo('Versement_Dechet_Ligne_Show check_reglement_dechet_numero data ', data)

      if (! data) {
        set_Versement_Dechet_Ligne_Value('montant', 0);
        return false
      }
      else {
        set_Versement_Dechet_Ligne_Value('montant', data.montant-data.montant_verse);
        return true
      }
    }
    catch (err) {
      throw err;
    }
  };
	
  async function set_Reglement_Dechet_Numero(value: number) {
    //consoleInfo('Versement_Dechet_Ligne_Show set_reglement_dechet_numero value ', value)
    set_Versement_Dechet_Ligne_Value('reglement_dechet_numero', value);
    const ret = await check_reglement_dechet_numero(value)
    //consoleInfo('Versement_Dechet_Ligne_Show set_reglement_dechet_numero ret ', ret)
    set_reglement_dechet_numero_forceOpen(false)
    if (ret === false) {
      set_reglement_dechet_numero_forceOpen(true)
    }
  }

  const handle_Reglement_Dechet_Numero_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Versement_Dechet_Ligne_Show handleBlur reglement_dechet_numero ', value)
    const ret = await check_reglement_dechet_numero(Number(value))
    //consoleInfo('Versement_Dechet_Ligne_Show handle_Reglement_Dechet_Numero_Blur ret ', ret)
    set_reglement_dechet_numero_forceOpen(false)
    if (ret === false) {
      set_reglement_dechet_numero_forceOpen(true)
    }
  };

	const Reglement_Dechet_Reste_A_Verser_Modal = (props: RdravMemListPageProps) => (
    <Reglement_Dechet_Reste_A_Verser {...props} isModalList={true} />
  )

  useEffect(() => {
    const load_Reglement_Dechet = async () => {
      try {
        setLoading(true)
        const response = await fetch_Reglement_Dechet(versement_Dechet_Ligne.reglement_dechet_numero)
        const data : Reglement_Dechet_Type = await getResponseData(response, 'Versement_Dechet_Ligne_Show load_Reglement_Dechet api error')
        //consoleInfo('Reglement_Dechet_Ligne_Show load_Reglement_Dechet data ', data)
        if (data === null) {
          set_Reglement_Dechet(Empty_Reglement_Dechet);
        }
        else {
          set_Reglement_Dechet(data);
        }
      }
      catch (err) {
        throw err;
      }
      finally {
        setLoading(false)
      }
    };

    load_Reglement_Dechet();
  }, [versement_Dechet_Ligne]);

  return (
    <GenericShowPage<Versement_Dechet_Ligne_Type>
      tableName={ VERSEMENT_DECHET_LIGNE_TABLE_NAME }
      columns={versement_Dechet_Ligne_Columns}
      apiUrl={`${ VERSEMENT_DECHET_FETCH_URL }/${id}/${ VERSEMENT_DECHET_LIGNE_CHILD_URL }`}
      entityId={childId}
      isEditMode={edit}
      loading={loading}
      childUrl={ VERSEMENT_DECHET_LIGNE_CHILD_URL }
      setRemoteMode={setMode}
      setEditedEntity={ set_Versement_Dechet_Ligne }
      getDisplayName={(versement_Dechet_Ligne: Versement_Dechet_Ligne_Type) => 'Versement déchets ligne '+versement_Dechet_Ligne.id}
      getId={(versement_Dechet_Ligne: Versement_Dechet_Ligne_Type) =>  versement_Dechet_Ligne.id }
      getEditedEntity={() => versement_Dechet_Ligne }
      getNewEntity={get_New_Versement_Dechet_Ligne }
      getDuplicateEntity={get_Duplicate_Versement_Dechet_Ligne }
      getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <MuiPKNumberField
            name="id"
            label="Id"
            value={ versement_Dechet_Ligne.id }
            fullWidth
            mode={"Browse"}
            error={!!errors.id }
            helperText={errors.id }
          />
          <MuiNumberField
            name="versement_dechet_numero"
            label="Versement"
            value={ versement_Dechet_Ligne.versement_dechet_numero }
            fullWidth
            error={!!errors.versement_dechet_numero }
            helperText={errors.versement_dechet_numero }
            mode={"Browse"}
          />
          <ReferenceField 
            name="reglement_dechet_numero"
            label="Réglement"
            value={ versement_Dechet_Ligne.reglement_dechet_numero }
            fullWidth
            onChange={handleChange}
            onBlur={handle_Reglement_Dechet_Numero_Blur}
            error={!!errors.reglement_dechet_numero }
            helperText={errors.reglement_dechet_numero }
            mode={mode}
            onClear={() => set_Versement_Dechet_Ligne_Value('reglement_dechet_numero', '')}  
            fieldName='NUMERO'
            setValue={function (value: any): void {
              set_Reglement_Dechet_Numero(value);
            }}
            maxRows="md"
            DataTableComponent={ Reglement_Dechet_Reste_A_Verser_Modal }
            followUrl={`${ REGLEMENT_DECHET_URL}/${ versement_Dechet_Ligne.reglement_dechet_numero }`}
            forceOpen={ reglement_dechet_numero_forceOpen }
          />
          <MuiTextField
            name="reglement_dechet_client_code"
            label="Client"
            value={ reglement_Dechet?.client_code }
            fullWidth
            mode={"Browse"}
          />
          <MuiTextField
            name="reglement_dechet_client_raison_sociale"
            label="Raison sociale"
            value={ reglement_Dechet?.client_raison_sociale }
            fullWidth
            mode={"Browse"}
          />
          <MuiDateField
            name="reglement_dechet_date_piece"
            label="Date réglement"
            value={ reglement_Dechet?.date_piece }
            fullWidth
            mode={"Browse"}
          />
          <MuiNumberField
            name="montant"
            label="Montant"
            fractionDigits={2}
            value={ versement_Dechet_Ligne.montant }
            fullWidth
            onChange={handleChange}
            error={!!errors.montant }
            helperText={errors.montant }
            mode={mode}
            onClear={() => set_Versement_Dechet_Ligne_Value('montant', '')}
          />
        </>
      }
    />
  );
};

export default Versement_Dechet_Ligne_Show;