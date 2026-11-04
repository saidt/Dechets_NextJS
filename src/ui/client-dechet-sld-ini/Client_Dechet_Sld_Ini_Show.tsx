"use client";

import {
  Empty_Client_Dechet_Sld_Ini,
  client_Dechet_Sld_Ini_Columns,
	CLIENT_DECHET_SLD_INI_SHOW_TITLE,
  CLIENT_DECHET_SLD_INI_FETCH_URL, 
  CLIENT_DECHET_SLD_INI_TABLE_NAME,
  client_Dechet_Sld_Ini_Schema,
  Client_Dechet_Sld_Ini_Type 
} from "@/types/client-dechet-sld-ini";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { CmListProps, Filter, Mode } from "@/lib/types";
import { useState } from "react";
import { MuiDateTimePicker, MuiNumberField, MuiPKNumberField, MuiPKTextField, MuiSwitch, MuiTextField } from "@/components/form-show/Inputs";
import { ReferenceField } from "@/components/form-show/ReferenceField";
import { useParams, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { getResponseData } from "@/lib/html";
import { Article_Type, ARTICLE_URL } from "@/types/article";
import Article_List from "../article/Article_List";
import { Client_Dechet_Type, CLIENT_DECHET_URL } from "@/types/client-dechet";
import Client_Dechet_List from "../client-dechet/Client_Dechet_List";
import { fetch_Article } from "@/fetch/article";
import { fetch_Client_Dechet } from "@/fetch/client-dechet";
import { DevaliderMenu, ValiderMenu } from "@/components/ui/menu/Menus";
import { useAppContext } from "@/app/context/AppContext";
import { put_Client_Dechet_Sld_Ini } from "@/fetch/client-dechet-sld-ini";
import { handleError } from "@/lib/error";
import { consoleInfo } from "@/lib/clientLog";
import useAuth from "@/app/context/UseAuth";

const Client_Dechet_Sld_Ini_Show = () => {
  const { addNotification } = useAppContext();

  const { id } = useParams<{ id: string }>();
  //consoleInfo('Client_Dechet_Sld_Ini_Show idParam: ', id)
  
  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Client_Dechet_Sld_Ini_Show edit: ', edit)

  const [client_Dechet_Sld_Ini, set_Client_Dechet_Sld_Ini] = useState<Client_Dechet_Sld_Ini_Type>(Empty_Client_Dechet_Sld_Ini);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Client_Dechet_Sld_Ini_Type, string>>>({});
  const [article_code_forceOpen, set_article_code_forceOpen] = useState<boolean>(false);
  const [client_code_forceOpen, set_client_code_forceOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  function validate(client_Dechet_Sld_Ini: Client_Dechet_Sld_Ini_Type) : boolean {    
    const result = client_Dechet_Sld_Ini_Schema.safeParse(client_Dechet_Sld_Ini);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Client_Dechet_Sld_Ini_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const get_New_Client_Dechet_Sld_Ini = () => {
    const newEntity : Client_Dechet_Sld_Ini_Type = Empty_Client_Dechet_Sld_Ini
    return newEntity
  }

  const get_Duplicate_Client_Dechet_Sld_Ini = () => {
    const { id, ...rest } : Client_Dechet_Sld_Ini_Type = client_Dechet_Sld_Ini;
    const dupEntity : Client_Dechet_Sld_Ini_Type = { id:0, ...rest}
    //consoleInfo('Client_Dechet_Sld_Ini_Show getDuplicateClient_Dechet_Sld_Ini dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (client_Dechet_Sld_Ini : Client_Dechet_Sld_Ini_Type, modifiedClient_Dechet_Sld_Ini : Partial<Client_Dechet_Sld_Ini_Type>) : Partial<Client_Dechet_Sld_Ini_Type> => {
    const modifiedWithId={ id: client_Dechet_Sld_Ini.id, ...modifiedClient_Dechet_Sld_Ini};
    return modifiedWithId
  }

  function set_Client_Dechet_Sld_Ini_Value(name: string, value: any) {
    //consoleInfo('Client_Dechet_Sld_Ini_Show set_Client_Dechet_Sld_Ini_Value name/value ', name, '/', value)
    set_Client_Dechet_Sld_Ini((prevClient_Dechet_Sld_Ini) => ({
      ...prevClient_Dechet_Sld_Ini,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_Client_Dechet_Sld_Ini_Value(name, value);
  };
	
	const check_article_code = async(value: string) : Promise<boolean> =>{
    try {
      const response = await fetch_Article(value);
      const data = await getResponseData(response, 'check_article_code api error')
      //consoleInfo('Client_Dechet_Sld_Ini_Show check_article_code data ', data)

      if (! data) {
        return false
      }
      else {
        return true
      }
    }
    catch (err) {
      handleError('check_article_code api error', err, addNotification)
      return false
    }
  };
	
  async function set_Article_Code(value: string) {
    //consoleInfo('Client_Dechet_Sld_Ini_Show set_article_code value ', value)
    set_Client_Dechet_Sld_Ini_Value('article_code', value);
    const ret = await check_article_code(value)
    //consoleInfo('Client_Dechet_Sld_Ini_Show set_article_code ret ', ret)
    set_article_code_forceOpen(false)
    if (ret === false) {
      set_article_code_forceOpen(true)
    }
  }

  const handle_Article_Code_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Client_Dechet_Sld_Ini_Show handleBlur article_code ', value)
    const ret = await check_article_code(value)
    //consoleInfo('Client_Dechet_Sld_Ini_Show handle_Article_Code_Blur ret ', ret)
    set_article_code_forceOpen(false)
    if (ret === false) {
      set_article_code_forceOpen(true)
    }
  };

  const article_initialFilter: Filter<Article_Type> = {
    code: client_Dechet_Sld_Ini.article_code
  };
	
	const Article_List_Modal = (props: CmListProps<Article_Type>) => (
    <Article_List {...props} isModalList={true} initialFilter={ article_initialFilter}/>
  )
	const check_client_code = async(value: string) : Promise<boolean> =>{
    try {
      const response = await fetch_Client_Dechet(value)
      const data = await getResponseData(response, 'check_client_code api error')
      //consoleInfo('Client_Dechet_Sld_Ini_Show check_client_code data ', data)

      if (! data) {
        return false
      }
      else {
        return true
      }
    }
    catch (err) {
      handleError('check_client_code api error', err, addNotification)
      return false
    }
  };
	
  async function set_Client_Code(value: string) {
    //consoleInfo('Client_Dechet_Sld_Ini_Show set_client_code value ', value)
    set_Client_Dechet_Sld_Ini_Value('client_code', value);
    const ret = await check_client_code(value)
    //consoleInfo('Client_Dechet_Sld_Ini_Show set_client_code ret ', ret)
    set_client_code_forceOpen(false)
    if (ret === false) {
      set_client_code_forceOpen(true)
    }
  }

  const handle_Client_Code_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Client_Dechet_Sld_Ini_Show handleBlur client_code ', value)
    const ret = await check_client_code(value)
    //consoleInfo('Client_Dechet_Sld_Ini_Show handle_Client_Code_Blur ret ', ret)
    set_client_code_forceOpen(false)
    if (ret === false) {
      set_client_code_forceOpen(true)
    }
  };

  const client_dechet_initialFilter: Filter<Client_Dechet_Type> = {
    code: client_Dechet_Sld_Ini.client_code
  };
	
	const Client_Dechet_List_Modal = (props: CmListProps<Client_Dechet_Type>) => (
    <Client_Dechet_List {...props} isModalList={true} initialFilter={ client_dechet_initialFilter}/>
  )

const handle_Valide = async() => {
    if (client_Dechet_Sld_Ini.valide === 'O') {
      addNotification("Solde initial client déchets déjà validé", "warning");
      return
    }
    setLoading(true)
    try {      
      const response  = await put_Client_Dechet_Sld_Ini(
        client_Dechet_Sld_Ini.id,
        {
          id:client_Dechet_Sld_Ini.id,
          valide : 'O'
        }
      )
      const data : Client_Dechet_Sld_Ini_Type = await getResponseData(response, 'Client_Dechet_Sld_Ini_Show handle_Valider')
      //consoleInfo('Retour_Dechet_Show handle_Valider data : ', data);
      set_Client_Dechet_Sld_Ini(data)
      addNotification("Solde initial client déchets validé", "success");
    }
    catch (err: any) {
      consoleInfo('Client_Dechet_Sld_Ini_Show handle_Valide err: ', err)
      handleError(String(err), err, addNotification)
      return false
    }
    finally {
      setLoading(false)
    }
  }

  const handle_Non_Valide = async() => {
    if (client_Dechet_Sld_Ini.valide === 'N') {
      consoleInfo('Client_Dechet_Sld_Ini_Show handle_Non_Valide: Solde initial client déchets déjà non validé');
      addNotification("Solde initial client déchets déjà non validé", "warning");
      return
    }
    setLoading(true)
    try {      
      const response  = await put_Client_Dechet_Sld_Ini(
        client_Dechet_Sld_Ini.id,
        {
          id:client_Dechet_Sld_Ini.id,
          valide : 'N'
        }
      )  
      const data : Client_Dechet_Sld_Ini_Type = await getResponseData(response, 'Client_Dechet_Sld_Ini_Show handle_Non_Valide')
      //consoleInfo('Client_Dechet_Sld_Ini_Show handle_Non_Valide data : ', data);
      set_Client_Dechet_Sld_Ini(data)
      consoleInfo('Client_Dechet_Sld_Ini_Show handle_Non_Valide: Solde initial client déchets non validé');
      addNotification("Solde initial client déchets non validé", "success");
    }
    catch (err) {
      handleError(String(err), err, addNotification)
      return false
    }
    finally {
      setLoading(false)
    }
  }

  const { hasRole } = useAuth();

  const optionsMenu : React.ReactNode[] = [
    (hasRole('dbo.CLIENT_DECHET_SLD_INI.VALIDER') && <ValiderMenu onClick={handle_Valide} />),
    (hasRole('dbo.CLIENT_DECHET_SLD_INI.DEVALIDER') && <DevaliderMenu onClick={handle_Non_Valide} />),
  ]

  return (
    <GenericShowPage<Client_Dechet_Sld_Ini_Type>
      tableName={ CLIENT_DECHET_SLD_INI_TABLE_NAME }
	    columns={ client_Dechet_Sld_Ini_Columns }
      apiUrl={ CLIENT_DECHET_SLD_INI_FETCH_URL}
      entityId={id}
      isEditMode={edit}
      loading={loading}
      optionsMenu={optionsMenu}
      setRemoteMode={setMode}
      setEditedEntity={ set_Client_Dechet_Sld_Ini }
      getDisplayName={(client_Dechet_Sld_Ini: Client_Dechet_Sld_Ini_Type) => CLIENT_DECHET_SLD_INI_SHOW_TITLE+" "+client_Dechet_Sld_Ini. id}
      getId={(client_Dechet_Sld_Ini: Client_Dechet_Sld_Ini_Type) =>  client_Dechet_Sld_Ini.id }
      getEditedEntity={() => client_Dechet_Sld_Ini }
      getNewEntity={get_New_Client_Dechet_Sld_Ini }
      getDuplicateEntity={get_Duplicate_Client_Dechet_Sld_Ini }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <MuiPKNumberField
            name="id"
            label="Id"
            value={ client_Dechet_Sld_Ini.id }
            fullWidth
            mode={mode}
            error={!!errors.id }
            helperText={errors.id }
            onChange={handleChange}
            onClear={() => set_Client_Dechet_Sld_Ini_Value("id", "")} 
          />
          <ReferenceField 
            name="article_code"
            label="Article"
            value={ client_Dechet_Sld_Ini.article_code }
            fullWidth
            onChange={handleChange}
            onBlur={handle_Article_Code_Blur}
            error={!!errors.article_code }
            helperText={errors.article_code }
            mode={mode}
            onClear={() => set_Client_Dechet_Sld_Ini_Value('article_code', '')}  
            fieldName='code'
            setValue={function (value: any): void {
              set_Article_Code(value);
            }}
            maxRows="md"
            DataTableComponent={ Article_List_Modal }
            followUrl={`${ ARTICLE_URL}/${ client_Dechet_Sld_Ini.article_code }`}
            forceOpen={ article_code_forceOpen }
          />
          <ReferenceField 
            name="client_code"
            label="Client"
            value={ client_Dechet_Sld_Ini.client_code }
            fullWidth
            onChange={handleChange}
            onBlur={handle_Client_Code_Blur}
            error={!!errors.client_code }
            helperText={errors.client_code }
            mode={mode}
            onClear={() => set_Client_Dechet_Sld_Ini_Value('client_code', '')}  
            fieldName='code'
            setValue={function (value: any): void {
              set_Client_Code(value);
            }}
            maxRows="md"
            DataTableComponent={ Client_Dechet_List_Modal }
            followUrl={`${ CLIENT_DECHET_URL}/${ client_Dechet_Sld_Ini.client_code }`}
            forceOpen={ client_code_forceOpen }
          />
          <MuiDateTimePicker
            name="date_debut"
            label='Date début'
            value={dayjs(client_Dechet_Sld_Ini.date_debut)}
            onChange={(date) => set_Client_Dechet_Sld_Ini_Value('date_debut', date)}
            mode={mode}
            onClear={() => set_Client_Dechet_Sld_Ini_Value("date_debut", null)}
            error={!!errors.date_debut }
            helperText={errors.date_debut }
            format="DD/MM/YYYY"
          />
          <MuiNumberField
            name="quantite"
            label="Quantité"
            fractionDigits={3}
            value={ client_Dechet_Sld_Ini.quantite }
            fullWidth
            onChange={handleChange}
            error={!!errors.quantite }
            helperText={errors.quantite }
            mode={mode}
            onClear={() => set_Client_Dechet_Sld_Ini_Value('quantite', '')}
          />
          <MuiSwitch
            name="valide"
            label="Validé"
            value={client_Dechet_Sld_Ini.valide}
            onChange={(e) => set_Client_Dechet_Sld_Ini_Value('valide', e.target.checked ? "O" : "N")}
            error={!!errors.valide}
            helperText={errors.valide}
            mode="Browse"
            checked={client_Dechet_Sld_Ini.valide === "O"}
          />
        </>
      }
    />
  );
};

export default Client_Dechet_Sld_Ini_Show;