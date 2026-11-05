"use client";

import {
  Empty_Retour_Dechet,
  RETOUR_DECHET_FETCH_URL,
  RETOUR_DECHET_TABLE_NAME,
  retour_Dechet_Schema,
  Retour_Dechet_Type,
  retour_Dechet_Columns,
} from "@/types/retour-dechet";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { CmListProps, Filter, Mode } from "@/lib/types";
import { useState } from "react";
import { MuiDateTimePicker, MuiNumberField, MuiPKNumberField, MuiSwitch, MuiTextField } from "@/components/form-show/Inputs";
import { ReferenceField } from "@/components/form-show/ReferenceField";
import { useParams, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { consoleInfo } from "@/lib/clientLog";
import { getResponseData } from "@/lib/html";
import { Client_Dechet_Type, CLIENT_DECHET_URL } from "@/types/client-dechet";
import Client_Dechet_List from "../client-dechet/Client_Dechet_List";

import { Divider, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import Retour_Dechet_Ligne_List from "./Retour_Dechet_Ligne_List";
import { ControleMenu, DevaliderMenu, NonControleMenu, ValiderMenu } from "@/components/ui/menu/Menus";
import { handleError } from "@/lib/error";
import { useAppContext } from "@/app/context/AppContext";
import useAuth from "@/app/context/UseAuth";
import { fetch_Client_Dechet } from "@/fetch/client-dechet";
import { put_Retour_Dechet } from "@/fetch/retour-dechet";
import { useSessionStorageState } from "@/components/hooks/useSessionStorageState";

const TAB_STORAGE_KEY = "RETOUR_DECHET_TAB";

// Declared at module level (not inside Retour_Dechet_Show) so each keeps the same
// component identity across re-renders: a component declared inside another
// one is a new type on every render, which remounts it (list reloaded, state
// lost) and, on an API error, re-notifies in an endless loop.
// Per-render values (filters) are passed through ReferenceField dataTableProps.
const Client_Dechet_List_Modal = (props: CmListProps<Client_Dechet_Type>) => (
  <Client_Dechet_List {...props} isModalList={true} />
);

const Retour_Dechet_Ligne_Child = () => (
  <Retour_Dechet_Ligne_List isModalList={false} />
);

const Retour_Dechet_Show = () => {

  const { id } = useParams<{ id: string }>();
  //consoleInfo('Retour_Dechet_Show idParam: ', id)

  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Retour_Dechet_Show edit: ', edit)

  const [retour_Dechet, set_Retour_Dechet] = useState<Retour_Dechet_Type>(Empty_Retour_Dechet);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Retour_Dechet_Type, string>>>({});
  const [client_code_forceOpen, set_client_code_forceOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useSessionStorageState(TAB_STORAGE_KEY, "1");

  function validate(retour_Dechet: Retour_Dechet_Type) : boolean {    
    const result = retour_Dechet_Schema.safeParse(retour_Dechet);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Retour_Dechet_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const get_New_Retour_Dechet = () => {
    const newEntity : Retour_Dechet_Type = Empty_Retour_Dechet
    return newEntity
  }

  const get_Duplicate_Retour_Dechet = () => {
    const { numero, ...rest } : Retour_Dechet_Type = retour_Dechet;
    const dupEntity : Retour_Dechet_Type = { numero:0, ...rest}
    //consoleInfo('Retour_Dechet_Show getDuplicateRetour_Dechet dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (retour_Dechet : Retour_Dechet_Type, modifiedRetour_Dechet : Partial<Retour_Dechet_Type>) : Partial<Retour_Dechet_Type> => {
    const modifiedWithId={ numero: retour_Dechet.numero, ...modifiedRetour_Dechet};
    return modifiedWithId
  }

  function set_Retour_Dechet_Value(name: string, value: any) {
    //consoleInfo('Retour_Dechet_Show set_Retour_Dechet_Value name/value ', name, '/', value)
    set_Retour_Dechet((prevRetour_Dechet) => ({
      ...prevRetour_Dechet,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_Retour_Dechet_Value(name, value);
  };

  const { addNotification } = useAppContext();
	
	const check_client_code = async(value: string) : Promise<boolean> =>{
    setLoading(true)
    try {      
      const response = await fetch_Client_Dechet(value)
      const data : Client_Dechet_Type = await getResponseData(response, 'check_client_code api error')
      //consoleInfo('Retour_Dechet_Show check_client_code data ', data)

      if (! data) {
        set_Retour_Dechet_Value('client_raison_sociale', '');
        return false
      }
      else {
        set_Retour_Dechet_Value('client_raison_sociale', data.raison_sociale);
        return true
      }
    }
    catch (err) {
      handleError(String(err), err, addNotification)
      return false
    }
    finally {
      setLoading(false)
    }
  };
	
	async function set_Client_Code(value: string) {
    //consoleInfo('Retour_Dechet_Show set_client_code value ', value)
    set_Retour_Dechet_Value('client_code', value);
    const ret = await check_client_code(value)
    //consoleInfo('Retour_Dechet_Show set_client_code ret ', ret)
    set_client_code_forceOpen(false)
    if (ret === false) {
      set_client_code_forceOpen(true)
    }
  }

  const handle_Client_Code_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Retour_Dechet_Show handleBlur client_code ', value)
    const ret = await check_client_code(value)
    //consoleInfo('Retour_Dechet_Show handle_Client_Code_Blur ret ', ret)
    set_client_code_forceOpen(false)
    if (ret === false) {
      set_client_code_forceOpen(true)
    }
  };

  const client_dechet_initialFilter: Filter<Client_Dechet_Type> = {
    code: retour_Dechet.client_code
  };
	

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };



  const handle_Valide = async() => {
    if (retour_Dechet.valide === 'O') {
      addNotification("Retour déchets déjà validé", "warning");
      return
    }
    setLoading(true)
    try {      
      const response  = await put_Retour_Dechet(
        retour_Dechet.numero,
        {
          numero:retour_Dechet.numero,
          valide : 'O'
        }
      )
      const data : Retour_Dechet_Type = await getResponseData(response, 'Retour_Dechet_Show handle_Valider')
      //consoleInfo('Retour_Dechet_Show handle_Valider data : ', data);
      set_Retour_Dechet(data)
      addNotification("Retour déchets validé", "success");
    }
    catch (err: any) {
      consoleInfo('Retour_Dechet_Show handle_Valide err: ', err)
      handleError(String(err), err, addNotification)
      return false
    }
    finally {
      setLoading(false)
    }
  }

  const handle_Non_Valide = async() => {
    if (retour_Dechet.valide === 'N') {
      addNotification("Retour déchets déjà non validé", "warning");
      return
    }
    setLoading(true)
    try {      
      const response  = await put_Retour_Dechet(
        retour_Dechet.numero,
        {
          numero:retour_Dechet.numero,
          valide : 'N'
        }
      )  
      const data : Retour_Dechet_Type = await getResponseData(response, 'Retour_Dechet_Show handle_Non_Valide')
      //consoleInfo('Retour_Dechet_Show handle_Non_Valide data : ', data);
      set_Retour_Dechet(data)
      addNotification("Retour déchets non validé", "success");
    }
    catch (err) {
      handleError(String(err), err, addNotification)
      return false
    }
    finally {
      setLoading(false)
    }
  }

  const handle_Controle = async() => {
    if (retour_Dechet.valide === 'O') {
      addNotification("Retour déchets déjà contrôlé", "error");
      return
    }
    setLoading(true)
    try {      
      const response  = await put_Retour_Dechet(
        retour_Dechet.numero,
        {
          numero:retour_Dechet.numero,
          controle : 'O'
        }
      )  
      const data : Retour_Dechet_Type  = await getResponseData(response, 'Retour_Dechet_Show handle_Valider')
      //consoleInfo('Retour_Dechet_Show handle_Valider data : ', data);
      set_Retour_Dechet(data)
      addNotification("Retour déchets contrôlé", "success");
    }
    catch (err) {
      handleError(String(err), err, addNotification)
      return false
    }
    finally {
      setLoading(false)
    }
  }

  const handle_Non_Controle = async() => {
    if (retour_Dechet.valide === 'O') {
      addNotification("Retour déchets déjà non contrôlé", "error");
      return
    }
    setLoading(true)
    try {      
      const response  = await put_Retour_Dechet(
        retour_Dechet.numero,
        {
          numero:retour_Dechet.numero,
          controle : 'N'
        }
      )  
      const data : Retour_Dechet_Type = await getResponseData(response, 'Retour_Dechet_Show handle_Non_Valide')
      //consoleInfo('Retour_Dechet_Show handle_Non_Valide data : ', data);
      set_Retour_Dechet(data)
      addNotification("Retour déchets non contrôlé", "success");
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
    (hasRole('dbo.RETOUR_DECHET.VALIDER') && <ValiderMenu onClick={handle_Valide} />),
    (hasRole('dbo.RETOUR_DECHET.DEVALIDER') && <DevaliderMenu onClick={handle_Non_Valide} />),
    <Divider />,
    (hasRole('dbo.RETOUR_DECHET.CONTROLE') && <ControleMenu onClick={handle_Controle} />),
    (hasRole('dbo.RETOUR_DECHET.NON_CONTROLE') && <NonControleMenu onClick={handle_Non_Controle} />),
  ]

  return (
    <GenericShowPage<Retour_Dechet_Type>
      tableName={ RETOUR_DECHET_TABLE_NAME }
      columns={retour_Dechet_Columns}
    	apiUrl={ RETOUR_DECHET_FETCH_URL}
      entityId={id}
      isEditMode={edit}
      loading={loading}
      optionsMenu={optionsMenu}
      setRemoteMode={setMode}
      setEditedEntity={ set_Retour_Dechet }
      getDisplayName={(retour_Dechet: Retour_Dechet_Type) => 'Retour déchets '+retour_Dechet. numero}
      getId={(retour_Dechet: Retour_Dechet_Type) =>  retour_Dechet.numero }
      getEditedEntity={() => retour_Dechet }
      getNewEntity={get_New_Retour_Dechet }
      getDuplicateEntity={get_Duplicate_Retour_Dechet }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <TabContext value={value}>
            <MuiPKNumberField
              name="numero"
              label="Numéro"
              value={ retour_Dechet.numero }
              fullWidth
              mode={mode}
              error={!!errors.numero }
              helperText={errors.numero }
              onChange={handleChange}
              onClear={() => set_Retour_Dechet_Value("numero", "")} 
            />
            <TabList onChange={handleTabChange}>
              <Tab key={"1"} label='Retour' value={"1"} />
              <Tab key={"2"} label='Lignes' value={"2"} />
            </TabList>
            <Divider />
            <TabPanel key={"1"} value={"1"}>
              <ReferenceField 
                name="client_code"
                label="Client"
                value={ retour_Dechet.client_code }
                fullWidth
                onChange={handleChange}
                onBlur={handle_Client_Code_Blur}
                error={!!errors.client_code }
                helperText={errors.client_code }
                mode={mode}
                onClear={() => set_Retour_Dechet_Value('client_code', '')}  
                fieldName='code'
                setValue={function (value: any): void {
                  set_Client_Code(value);
                }}
                maxRows="md"
                DataTableComponent={ Client_Dechet_List_Modal }
                dataTableProps={{ initialFilter: client_dechet_initialFilter }}
                followUrl={`${ CLIENT_DECHET_URL}/${ retour_Dechet.client_code }`}
                forceOpen={client_code_forceOpen}
              />
              <MuiTextField
                name="client_raison_sociale"
                label="Raison sociale"
                value={ retour_Dechet.client_raison_sociale }
                fullWidth
                mode={mode}
                error={!!errors.client_raison_sociale }
                helperText={errors.client_raison_sociale }
                onChange={handleChange}
                onClear={() => set_Retour_Dechet_Value("client_raison_sociale", "")}
              />
              <MuiDateTimePicker
                name="date_piece"
                label='Date retour'
                value={dayjs(retour_Dechet.date_piece)}
                onChange={(date) => set_Retour_Dechet_Value('date_piece', date)}
                mode={mode}
                onClear={() => set_Retour_Dechet_Value("date_piece", null)}
                slotProps={{
                  textField: {
                    error: !!errors.date_piece,
                    helperText: errors.date_piece
                  }
                }}
                format="DD/MM/YYYY"
              />
              <MuiNumberField
                name="montant"
                label="Montant"
                fractionDigits={2}
                value={ retour_Dechet.montant }
                fullWidth
                error={!!errors.montant }
                helperText={errors.montant }
                mode="Browse"
                onClear={() => set_Retour_Dechet_Value('montant', '')}
              />
              <MuiNumberField
                name="montant_regle"
                label="Montant réglé"
                fractionDigits={2}
                value={ retour_Dechet.montant_regle }
                fullWidth
                error={!!errors.montant_regle }
                helperText={errors.montant_regle }
                mode="Browse"
              />
              <MuiDateTimePicker
                name="date_sortie"
                label='Date sortie'
                value={dayjs(retour_Dechet.date_sortie)}
                onChange={(date) => set_Retour_Dechet_Value('date_sortie', date)}
                mode={mode}
                onClear={() => set_Retour_Dechet_Value("date_sortie", null)}
                slotProps={{
                  textField: {
                    error: !!errors.date_sortie,
                    helperText: errors.date_sortie
                  }
                }}
                format="DD/MM/YYYY"
              />
              <MuiSwitch
                name="valide"
                label="Validé"
                value={retour_Dechet.valide}
                onChange={(e) => set_Retour_Dechet_Value('valide', e.target.checked ? "O" : "N")}
                error={!!errors.valide}
                helperText={errors.valide}
                mode="Browse"
                checked={retour_Dechet.valide === "O"}
              />
              <br/>
              <MuiSwitch
                name="controle"
                label="Contrôlé"
                value={retour_Dechet.controle}
                onChange={(e) => set_Retour_Dechet_Value('controle', e.target.checked ? "O" : "N")}
                error={!!errors.controle}
                helperText={errors.controle}
                mode="Browse"
                checked={retour_Dechet.controle === "O"}
              />
					  </TabPanel>
            <TabPanel key={"2"} value={"2"}>
              <Retour_Dechet_Ligne_Child />
            </TabPanel>
          </TabContext>
        </>
      }
    />
  );
};

export default Retour_Dechet_Show;