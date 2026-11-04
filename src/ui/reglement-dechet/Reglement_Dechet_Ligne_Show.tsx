"use client";

import {
  Empty_Reglement_Dechet_Ligne,
  REGLEMENT_DECHET_LIGNE_CHILD_URL,
  REGLEMENT_DECHET_LIGNE_TABLE_NAME,
  reglement_Dechet_Ligne_Schema,
  Reglement_Dechet_Ligne_Type,
  reglement_Dechet_Ligne_Columns,
} from "@/types/reglement-dechet-ligne";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { Mode } from "@/lib/types";
import { useEffect, useState } from "react";
import { MuiDateField, MuiNumberField, MuiPKNumberField, MuiTextField } from "@/components/form-show/Inputs";
import { ReferenceField } from "@/components/form-show/ReferenceField";
import { useParams, useSearchParams } from "next/navigation";
import { getResponseData } from "@/lib/html";
import { Empty_Sortie_Dechet, Sortie_Dechet_Type, SORTIE_DECHET_URL } from "@/types/sortie-dechet";
import { Empty_Reglement_Dechet, REGLEMENT_DECHET_FETCH_URL, Reglement_Dechet_Type } from "@/types/reglement-dechet";
import Client_Dechet_Reste_A_Payer, { CdrapMemListPageProps } from "../client-dechet/Client_Dechet_Reste_A_Payer";
import { consoleInfo } from "@/lib/clientLog";
import { fetch_Sortie_Dechet } from "@/fetch/sortie-dechet";
import { fetch_Reglement_Dechet } from "@/fetch/reglement-dechet";
import { useAppContext } from "@/app/context/AppContext";
import { handleError } from "@/lib/error";

const Reglement_Dechet_Ligne_Show = () => {
  const { addNotification } = useAppContext();
  const { id, childId } = useParams<{ id: string; childId: string }>();

  //consoleInfo('Reglement_Dechet_Ligne_Show id Param: ', id)
  //consoleInfo('Reglement_Dechet_Ligne_Show childId Param: ', childId)

  const empty_Reglement_Dechet_Ligne = Empty_Reglement_Dechet_Ligne;
  empty_Reglement_Dechet_Ligne.reglement_dechet_numero = Number(id)

  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Reglement_Dechet_Ligne_Show edit: ', edit)

  const [reglement_Dechet_Ligne, set_Reglement_Dechet_Ligne] = useState<Reglement_Dechet_Ligne_Type>(Empty_Reglement_Dechet_Ligne);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Reglement_Dechet_Ligne_Type, string>>>({});
  const [sortie_dechet_numero_forceOpen, set_sortie_dechet_numero_forceOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [reglement_Dechet, set_Reglement_Dechet] = useState<Reglement_Dechet_Type>(Empty_Reglement_Dechet);
  const [sortie_Dechet, set_Sortie_Dechet] = useState<Sortie_Dechet_Type>(Empty_Sortie_Dechet);

  function validate(reglement_Dechet_Ligne: Reglement_Dechet_Ligne_Type) : boolean {    
    const result = reglement_Dechet_Ligne_Schema.safeParse(reglement_Dechet_Ligne);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Reglement_Dechet_Ligne_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const get_New_Reglement_Dechet_Ligne = () => {
    const newEntity : Reglement_Dechet_Ligne_Type = Empty_Reglement_Dechet_Ligne
    return newEntity
  }

  const get_Duplicate_Reglement_Dechet_Ligne = () => {
    const { id, ...rest } : Reglement_Dechet_Ligne_Type = reglement_Dechet_Ligne;
    const dupEntity : Reglement_Dechet_Ligne_Type = { id:0, ...rest}
    //consoleInfo('Reglement_Dechet_Ligne_Show getDuplicateReglement_Dechet_Ligne dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (reglement_Dechet_Ligne : Reglement_Dechet_Ligne_Type, modifiedReglement_Dechet_Ligne : Partial<Reglement_Dechet_Ligne_Type>) : Partial<Reglement_Dechet_Ligne_Type> => {
    const modifiedWithId={ id: reglement_Dechet_Ligne.id, ...modifiedReglement_Dechet_Ligne};
    return modifiedWithId
  }

  function set_Reglement_Dechet_Ligne_Value(name: string, value: any) {
    //consoleInfo('Reglement_Dechet_Ligne_Show set_Reglement_Dechet_Ligne_Value name/value ', name, '/', value)
    set_Reglement_Dechet_Ligne((prevReglement_Dechet_Ligne) => ({
      ...prevReglement_Dechet_Ligne,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_Reglement_Dechet_Ligne_Value(name, value);
  };
	
	const check_sortie_dechet_numero = async(value: number) : Promise<boolean> =>{
    try {
      const response = await fetch_Sortie_Dechet(value)
      const data : Sortie_Dechet_Type = await getResponseData(response, 'check_sortie_dechet_numero api error')
      //consoleInfo('Reglement_Dechet_Ligne_Show check_sortie_dechet_numero data ', data)

      if (! data) {
        set_Reglement_Dechet_Ligne_Value('montant', 0);
        return false
      }
      else {
        set_Reglement_Dechet_Ligne_Value('montant',data.montant-data.montant_regle);
        return true
      }
    }
    catch (err) {
      handleError('check_sortie_dechet_numero api error', err, addNotification)
      return false
    }
  };
	
  async function set_Sortie_Dechet_Numero(value: number) {
    //consoleInfo('Reglement_Dechet_Ligne_Show set_sortie_dechet_numero value ', value)
    set_Reglement_Dechet_Ligne_Value('sortie_dechet_numero', value);
    const ret = await check_sortie_dechet_numero(value)
    //consoleInfo('Reglement_Dechet_Ligne_Show set_sortie_dechet_numero ret ', ret)
    set_sortie_dechet_numero_forceOpen(false)
    if (ret === false) {
      set_sortie_dechet_numero_forceOpen(true)
    }
  }

  const handle_Sortie_Dechet_Numero_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Reglement_Dechet_Ligne_Show handleBlur sortie_dechet_numero ', value)
    const ret = await check_sortie_dechet_numero(Number(value))
    //consoleInfo('Reglement_Dechet_Ligne_Show handle_Sortie_Dechet_Numero_Blur ret ', ret)
    set_sortie_dechet_numero_forceOpen(false)
    if (ret === false) {
      set_sortie_dechet_numero_forceOpen(true)
    }
  };

  const Client_Dechet_Reste_A_Payer_Modal = (props: CdrapMemListPageProps) => (
    <Client_Dechet_Reste_A_Payer {...props} isModalList={true} code={reglement_Dechet.client_code}/>
  )
	
    useEffect(() => {
    const load_Reglement_Dechet = async () => {
      try {
        setLoading(true)
        const response = await fetch_Reglement_Dechet(reglement_Dechet_Ligne.reglement_dechet_numero)
        const data : Reglement_Dechet_Type = await getResponseData(response, 'Reglement_Dechet_Ligne_Show load_Reglement_Dechet api error')
        consoleInfo('Reglement_Dechet_Ligne_Show load_Reglement_Dechet data ', data)
        set_Reglement_Dechet(data);
      }
      catch (err) {
        handleError('load_Reglement_Dechet api error', err, addNotification)
      }
      finally {
        setLoading(false)
      }
    };

    load_Reglement_Dechet();
  }, []);
  
  useEffect(() => {
    const load_Sortie_Dechet = async () => {
      try {
        setLoading(true)
        const response = await fetch_Sortie_Dechet(reglement_Dechet_Ligne.sortie_dechet_numero)
        const data : Sortie_Dechet_Type = await getResponseData(response, 'Reglement_Dechet_Ligne_Show load_Sortie_Dechet api error')
        consoleInfo('Reglement_Dechet_Ligne_Show load_Sortie_Dechet data ', data)
        if (data === null) {
          set_Sortie_Dechet(Empty_Sortie_Dechet);
        }
        else {
          set_Sortie_Dechet(data);
        }
      }
      catch (err) {
        handleError('load_Sortie_Dechet api error', err, addNotification)
      }
      finally {
        setLoading(false)
      }
    };

    load_Sortie_Dechet();
  }, [reglement_Dechet_Ligne]);
  
return (
    <GenericShowPage<Reglement_Dechet_Ligne_Type>
      tableName={ REGLEMENT_DECHET_LIGNE_TABLE_NAME }
      columns={reglement_Dechet_Ligne_Columns}
      apiUrl={`${REGLEMENT_DECHET_FETCH_URL}/${id}/${REGLEMENT_DECHET_LIGNE_CHILD_URL}`}
      entityId={childId}
      isEditMode={edit}
      loading={loading}
      childUrl= { REGLEMENT_DECHET_LIGNE_CHILD_URL }
      setRemoteMode={setMode}
      setEditedEntity={ set_Reglement_Dechet_Ligne }
      getDisplayName={(reglement_Dechet_Ligne: Reglement_Dechet_Ligne_Type) => 'Réglement dechets ligne '+reglement_Dechet_Ligne. id}
      getId={(reglement_Dechet_Ligne: Reglement_Dechet_Ligne_Type) =>  reglement_Dechet_Ligne.id }
      getEditedEntity={() => reglement_Dechet_Ligne }
      getNewEntity={get_New_Reglement_Dechet_Ligne }
      getDuplicateEntity={get_Duplicate_Reglement_Dechet_Ligne }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <MuiPKNumberField
            name="id"
            label="Id"
            value={ reglement_Dechet_Ligne.id }
            fullWidth
            mode={"Browse"}
            error={!!errors.id }
            helperText={errors.id }
          />
          <MuiNumberField
            name="reglement_dechet_numero"
            label="N° réglement déchets"
            value={ reglement_Dechet_Ligne.reglement_dechet_numero }
            fullWidth
            error={!!errors.reglement_dechet_numero }
            helperText={errors.reglement_dechet_numero }
            mode={"Browse"}
          />
          <ReferenceField 
            name="sortie_dechet_numero"
            label="N° sortie"
            value={ reglement_Dechet_Ligne.sortie_dechet_numero }
            fullWidth
            onChange={handleChange}
            onBlur={handle_Sortie_Dechet_Numero_Blur}
            error={!!errors.sortie_dechet_numero }
            helperText={errors.sortie_dechet_numero }
            mode={mode}
            onClear={() => set_Reglement_Dechet_Ligne_Value('sortie_dechet_numero', '')}  
            fieldName='NUMERO'
            setValue={function (value: any): void {
              set_Sortie_Dechet_Numero(value);
            }}
            maxRows="md"
            DataTableComponent={ Client_Dechet_Reste_A_Payer_Modal }
            followUrl={`${ SORTIE_DECHET_URL}/${ reglement_Dechet_Ligne.sortie_dechet_numero }`}
            forceOpen={ sortie_dechet_numero_forceOpen }
          />
          <MuiTextField
            name="sortie_dechet_client_code"
            label="Client"
            value={ sortie_Dechet?.client_code }
            fullWidth
            mode={"Browse"}
          />
          <MuiTextField
            name="sortie_dechet_client_raison_sociale"
            label="Raison sociale"
            value={ sortie_Dechet?.client_raison_sociale }
            fullWidth
            mode={"Browse"}
          />
          <MuiDateField
            name="sortie_dechet_date_piece"
            label="Date sortie"
            value={ sortie_Dechet?.date_piece }
            fullWidth
            mode={"Browse"}
          />
          <MuiNumberField
            name="montant"
            label="Montant"
            fractionDigits={2}
            value={ reglement_Dechet_Ligne.montant }
            fullWidth
            onChange={handleChange}
            error={!!errors.montant }
            helperText={errors.montant }
            mode={mode}
            onClear={() => set_Reglement_Dechet_Ligne_Value('montant', '')}
          />
        </>
      }
    />
  );
};

export default Reglement_Dechet_Ligne_Show;