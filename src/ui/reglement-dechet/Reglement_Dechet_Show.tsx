"use client";

import {
  Empty_Reglement_Dechet,
  REGLEMENT_DECHET_FETCH_URL,
  REGLEMENT_DECHET_TABLE_NAME,
  reglement_Dechet_Schema,
  Reglement_Dechet_Type,
  reglement_Dechet_Columns,
} from "@/types/reglement-dechet";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { CmListProps, Filter, Mode } from "@/lib/types";
import { useEffect, useState } from "react";
import { MuiDateTimePicker, MuiNumberField, MuiPKNumberField, MuiPKTextField, MuiSwitch, MuiTextField } from "@/components/form-show/Inputs";
import { ReferenceField } from "@/components/form-show/ReferenceField";
import { useParams, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
//import { consoleInfo } from "@/lib/log";
import { getResponseData } from "@/lib/html";
import { Client_Dechet_Type, CLIENT_DECHET_URL } from "@/types/client-dechet";
import Client_Dechet_List from "../client-dechet/Client_Dechet_List";

import { Divider, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useAppContext } from "@/app/context/AppContext";
import { handleError } from "@/lib/error";
import { consoleInfo } from "@/lib/clientLog";
import useAuth from "@/app/context/UseAuth";
import { DevaliderMenu, ValiderMenu } from "@/components/ui/menu/Menus";

import Reglement_Dechet_Ligne_List from "./Reglement_Dechet_Ligne_List";
import { fetch_Client_Dechet } from "@/fetch/client-dechet";
import { put_Reglement_Dechet } from "@/fetch/reglement-dechet";

const TAB_STORAGE_KEY = "REGLEMENT_DECHET_TAB";

const Reglement_Dechet_Show = () => {
  //const { addNotification } = useAppContext();

  const { id } = useParams<{ id: string }>();
  //consoleInfo('Sortie_Dechet_Show idParam: ', id)

  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Reglement_Dechet_Show edit: ', edit)

  const [reglement_Dechet, set_Reglement_Dechet] = useState<Reglement_Dechet_Type>(Empty_Reglement_Dechet);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Reglement_Dechet_Type, string>>>({});
  const [client_code_forceOpen, set_client_code_forceOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(sessionStorage.getItem(TAB_STORAGE_KEY) || "1");

  function validate(reglement_Dechet: Reglement_Dechet_Type) : boolean {    
    const result = reglement_Dechet_Schema.safeParse(reglement_Dechet);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Reglement_Dechet_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const get_New_Reglement_Dechet = () => {
    const newEntity : Reglement_Dechet_Type = Empty_Reglement_Dechet
    return newEntity
  }

  const get_Duplicate_Reglement_Dechet = () => {
    const { numero, ...rest } : Reglement_Dechet_Type = reglement_Dechet;
    const dupEntity : Reglement_Dechet_Type = { numero:0, ...rest}
    //consoleInfo('Reglement_Dechet_Show getDuplicateReglement_Dechet dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (reglement_Dechet : Reglement_Dechet_Type, modifiedReglement_Dechet : Partial<Reglement_Dechet_Type>) : Partial<Reglement_Dechet_Type> => {
    const modifiedWithId={ numero: reglement_Dechet.numero, ...modifiedReglement_Dechet};
    return modifiedWithId
  }

  function set_Reglement_Dechet_Value(name: string, value: any) {
    //consoleInfo('Reglement_Dechet_Show set_Reglement_Dechet_Value name/value ', name, '/', value)
    set_Reglement_Dechet((prevReglement_Dechet) => ({
      ...prevReglement_Dechet,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_Reglement_Dechet_Value(name, value);
  };
	
	const check_client_code = async(value: string) : Promise<boolean> =>{
    try {
      const response = await fetch_Client_Dechet(value)
      const data : Client_Dechet_Type = await getResponseData(response, 'check_client_code api error')
      //consoleInfo('Reglement_Dechet_Show check_client_code data ', data)

      if (! data) {
        set_Reglement_Dechet_Value('client_raison_sociale', '');
        return false
      }
      else {
        set_Reglement_Dechet_Value('client_raison_sociale', data.raison_sociale);
        return true
      }
    }
    catch (err) {
      throw err;
    }
  };
	
  async function set_Client_Code(value: string) {
    //consoleInfo('Reglement_Dechet_Show set_client_code value ', value)
    set_Reglement_Dechet_Value('client_code', value);
    const ret = await check_client_code(value)
    //consoleInfo('Reglement_Dechet_Show set_client_code ret ', ret)
    set_client_code_forceOpen(false)
    if (ret === false) {
      set_client_code_forceOpen(true)
    }
  }

  const handle_Client_Code_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Reglement_Dechet_Show handleBlur client_code ', value)
    const ret = await check_client_code(value)
    //consoleInfo('Reglement_Dechet_Show handle_Client_Code_Blur ret ', ret)
    set_client_code_forceOpen(false)
    if (ret === false) {
      set_client_code_forceOpen(true)
    }
  };

  const client_dechet_fk_initialFilter: Filter<Client_Dechet_Type> = {
    code: reglement_Dechet.client_code
  };
	
	const Client_Dechet_List_Modal = (props: CmListProps<Client_Dechet_Type>) => (
    <Client_Dechet_List {...props} isModalList={true} initialFilter={ client_dechet_fk_initialFilter}/>
  )

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    sessionStorage.setItem(TAB_STORAGE_KEY, value);
  }, [value]);

  const Reglement_Dechet_Ligne_Child = () => (
    <Reglement_Dechet_Ligne_List isModalList={false} />
  )

  const { addNotification } = useAppContext();

  const handle_Valide = async() => {
    if (reglement_Dechet.valide === 'O') {
      addNotification("Réglement déchets déjà validé", "warning");
      return
    }
    setLoading(true)
    try {
      const response  = await put_Reglement_Dechet(
        reglement_Dechet.numero,
        {
          numero: reglement_Dechet.numero,
          valide : 'O'
        }
      )
      const data : Reglement_Dechet_Type = await getResponseData(response, 'Reglement_Dechet_Show handle_Valider')
      //consoleInfo('Reglement_Dechet_Show handle_Valider data : ', data);
      set_Reglement_Dechet(data)
      addNotification("Réglement déchets validé", "success");
    }
    catch (err: any) {
      consoleInfo('Reglement_Dechet_Show handle_Valide err: ', err)
      handleError(String(err), err, addNotification)
      return false
    }
    finally {
      setLoading(false)
    }
  }

  const handle_Non_Valide = async() => {
    if (reglement_Dechet.valide === 'N') {
      addNotification("Réglement déchets déjà non validé", "warning");
      return
    }
    setLoading(true)
    try {      
      const response  = await put_Reglement_Dechet(
        reglement_Dechet.numero,
        {
          numero: reglement_Dechet.numero,
          valide : 'N'
        }
      )
      const data : Reglement_Dechet_Type = await getResponseData(response, 'Reglement_Dechet_Show handle_Non_Valide')
      //consoleInfo('Reglement_Dechet_Show handle_Non_Valide data : ', data);
      set_Reglement_Dechet(data)
      addNotification("Réglement déchets non validé", "success");
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
    (hasRole('dbo.REGLEMENT_DECHET.VALIDER') && <ValiderMenu onClick={handle_Valide} />),
    (hasRole('dbo.REGLEMENT_DECHET.DEVALIDER') && <DevaliderMenu onClick={handle_Non_Valide} />),
  ]

  return (
    <GenericShowPage<Reglement_Dechet_Type>
      tableName={ REGLEMENT_DECHET_TABLE_NAME }
      columns={reglement_Dechet_Columns}
      apiUrl={ REGLEMENT_DECHET_FETCH_URL}
      entityId={id}
      isEditMode={edit}
      loading={loading}
      optionsMenu={optionsMenu}
      setRemoteMode={setMode}
      setEditedEntity={ set_Reglement_Dechet }
      getDisplayName={(reglement_Dechet: Reglement_Dechet_Type) => 'Réglement déchets '+reglement_Dechet. numero}
      getId={(reglement_Dechet: Reglement_Dechet_Type) =>  reglement_Dechet.numero }
      getEditedEntity={() => reglement_Dechet }
      getNewEntity={get_New_Reglement_Dechet }
      getDuplicateEntity={get_Duplicate_Reglement_Dechet }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <MuiPKNumberField
            name="numero"
            label="Numéro"
            value={ reglement_Dechet.numero }
            fullWidth
            mode={mode}
            error={!!errors.numero }
            helperText={errors.numero }
            onChange={handleChange}
            onClear={() => set_Reglement_Dechet_Value("numero", "")} 
          />
				  <TabContext value={value}>
            <TabList
              onChange={handleTabChange} 
              sx={ {
                "& .Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  borderRadius: 1,
                },
              } }
            >
              <Tab key={"1"} label='Réglement' value={"1"} />
              <Tab key={"2"} label='Sorties' value={"2"} />
            </TabList>
            <Divider />
            <TabPanel key={"1"} value={"1"}>
              <ReferenceField 
                name="client_code"
                label="Client"
                value={ reglement_Dechet.client_code }
                fullWidth
                onChange={handleChange}
                onBlur={handle_Client_Code_Blur}
                error={!!errors.client_code }
                helperText={errors.client_code }
                mode={mode}
                onClear={() => set_Reglement_Dechet_Value('client_code', '')}  
                fieldName='code'
                setValue={function (value: any): void {
                  set_Client_Code(value);
                }}
                maxRows="md"
                DataTableComponent={ Client_Dechet_List_Modal }
                followUrl={`${ CLIENT_DECHET_URL}/${ reglement_Dechet.client_code }`}
                forceOpen={ client_code_forceOpen }
              />
              <MuiDateTimePicker
                name="date_piece"
                label='Date'
                value={dayjs(reglement_Dechet.date_piece)}
                onChange={(date) => set_Reglement_Dechet_Value('date_piece', date)}
                mode={mode}
                onClear={() => set_Reglement_Dechet_Value("date_piece", null)}
                slotProps={ {
                  textField: {
                    error: !!errors.date_piece,
                    helperText: errors.date_piece
                  }
                } }
                format="DD/MM/YYYY"
              />
              <MuiTextField
                name="client_raison_sociale"
                label="Raison sociale"
                value={ reglement_Dechet.client_raison_sociale }
                fullWidth
                mode={mode}
                error={!!errors.client_raison_sociale }
                helperText={errors.client_raison_sociale }
                onChange={handleChange}
                onClear={() => set_Reglement_Dechet_Value("client_raison_sociale", "")}
              />
              <MuiNumberField
                name="montant"
                label="Montant"
                fractionDigits={2}
                value={ reglement_Dechet.montant }
                fullWidth
                onChange={handleChange}
                error={!!errors.montant }
                helperText={errors.montant }
                mode={mode}
                onClear={() => set_Reglement_Dechet_Value('montant', '')}
              />
              <MuiNumberField
                name="montant_regle"
                label="MONTANT réglé"
                fractionDigits={2}
                value={ reglement_Dechet.montant_regle }
                fullWidth
                error={!!errors.montant_regle }
                helperText={errors.montant_regle }
                mode="Browse"
              />
              <MuiNumberField
                name="montant_verse"
                label="MONTANT versé"
                fractionDigits={2}
                value={ reglement_Dechet.montant_verse }
                fullWidth
                error={!!errors.montant_verse }
                helperText={errors.montant_verse }
                mode="Browse"
              />
              <MuiSwitch
                name="valide"
                label="Validé"
                value={reglement_Dechet.valide}
                onChange={(e) => set_Reglement_Dechet_Value('valide', e.target.checked ? "O" : "N")}
                error={!!errors.valide}
                helperText={errors.valide}
                mode="Browse"
                checked={reglement_Dechet.valide === "O"}
              />
					  </TabPanel>
            <TabPanel key={"2"} value={"2"}>
              <Reglement_Dechet_Ligne_Child />
            </TabPanel>
          </TabContext>
        </>
      }
    />
  );
};

export default Reglement_Dechet_Show;