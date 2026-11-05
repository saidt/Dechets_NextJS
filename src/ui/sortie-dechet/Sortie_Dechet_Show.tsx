"use client";

import {
  Empty_Sortie_Dechet,
  SORTIE_DECHET_FETCH_URL,
  SORTIE_DECHET_TABLE_NAME,
  sortie_Dechet_Schema,
  Sortie_Dechet_Type,
  sortie_Dechet_Columns,
} from "@/types/sortie-dechet";
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

import { Divider, ListItemIcon, MenuItem, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import Sortie_Dechet_Detail_List from "./Sortie_Dechet_Detail_List";
import Sortie_Dechet_Ligne_List from "./Sortie_Dechet_Ligne_List";
import { ControleMenu, DevaliderMenu, NonControleMenu, ValiderMenu } from "@/components/ui/menu/Menus";
import { handleError } from "@/lib/error";
import { useAppContext } from "@/app/context/AppContext";
import SecurityUpdateIcon from '@mui/icons-material/SecurityUpdate';
import Sortie_Dechet_Maj_Prix_Detail from "./Sortie_Dechet_Maj_Prix_Detail";
import useAuth from "@/app/context/UseAuth";
import { sortie_Dechet_Show_Print } from "./Sortie_Dechet_Show_Print";
import { useSession } from "next-auth/react";
import PrintIcon from "@mui/icons-material/Print";
import { sortie_Dechet_Show_Print_Simple } from "./Sortie_Dechet_Show_Print_Simple";
import { fetch_Client_Dechet } from "@/fetch/client-dechet";
import { put_Sortie_Dechet } from "@/fetch/sortie-dechet";
import { useSessionStorageState } from "@/components/hooks/useSessionStorageState";

const TAB_STORAGE_KEY = "SORTIE_DECHET_TAB";

// Declared at module level (not inside Sortie_Dechet_Show) so each keeps the same
// component identity across re-renders: a component declared inside another
// one is a new type on every render, which remounts it (list reloaded, state
// lost) and, on an API error, re-notifies in an endless loop.
// Per-render values (filters) are passed through ReferenceField dataTableProps.
const Client_Dechet_List_Modal = (props: CmListProps<Client_Dechet_Type>) => (
  <Client_Dechet_List {...props} isModalList={true} />
);

const Sortie_Dechet_Detail_Child = () => (
  <Sortie_Dechet_Detail_List isModalList={false} />
);

const Sortie_Dechet_Ligne_Child = () => (
  <Sortie_Dechet_Ligne_List isModalList={false} />
);

const Sortie_Dechet_Show = () => {
  //const { addNotification } = useAppContext();

  const { id } = useParams<{ id: string }>();
  //consoleInfo('Sortie_Dechet_Show idParam: ', id)

  const { data: session } = useSession()
  const user = session?.user

  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Sortie_Dechet_Show edit: ', edit)

  const [sortie_Dechet, set_Sortie_Dechet] = useState<Sortie_Dechet_Type>(Empty_Sortie_Dechet);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Sortie_Dechet_Type, string>>>({});
  const [client_code_forceOpen, set_client_code_forceOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [majPrixDetailOpen, setMajPrixDetailOpen] = useState(false);
  const [value, setValue] = useSessionStorageState(TAB_STORAGE_KEY, "1");

  function validate(sortie_Dechet: Sortie_Dechet_Type) : boolean {    
    const result = sortie_Dechet_Schema.safeParse(sortie_Dechet);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Sortie_Dechet_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const get_New_Sortie_Dechet = () => {
    const newEntity : Sortie_Dechet_Type = Empty_Sortie_Dechet
    return newEntity
  }

  const get_Duplicate_Sortie_Dechet = () => {
    const { numero, ...rest } : Sortie_Dechet_Type = sortie_Dechet;
    const dupEntity : Sortie_Dechet_Type = { numero:0, ...rest}
    //consoleInfo('Sortie_Dechet_Show getDuplicateSortie_Dechet dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (sortie_Dechet : Sortie_Dechet_Type, modifiedSortie_Dechet : Partial<Sortie_Dechet_Type>) : Partial<Sortie_Dechet_Type> => {
    const modifiedWithId={ numero: sortie_Dechet.numero, ...modifiedSortie_Dechet};
    return modifiedWithId
  }

  function set_Sortie_Dechet_Value(name: string, value: any) {
    //consoleInfo('Sortie_Dechet_Show set_Sortie_Dechet_Value name/value ', name, '/', value)
    set_Sortie_Dechet((prevSortie_Dechet) => ({
      ...prevSortie_Dechet,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_Sortie_Dechet_Value(name, value);
  };

  const { addNotification } = useAppContext();
	
	const check_client_code = async(value: string) : Promise<boolean> =>{
    setLoading(true)
    try {      
      const response = await fetch_Client_Dechet(value)
      const data : Client_Dechet_Type = await getResponseData(response, 'check_client_code api error')
      //consoleInfo('Sortie_Dechet_Show check_client_code data ', data)

      if (! data) {
        set_Sortie_Dechet_Value('client_raison_sociale', '');
        return false
      }
      else {
        set_Sortie_Dechet_Value('client_raison_sociale', data.raison_sociale);
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
    //consoleInfo('Sortie_Dechet_Show set_client_code value ', value)
    set_Sortie_Dechet_Value('client_code', value);
    const ret = await check_client_code(value)
    //consoleInfo('Sortie_Dechet_Show set_client_code ret ', ret)
    set_client_code_forceOpen(false)
    if (ret === false) {
      set_client_code_forceOpen(true)
    }
  }

  const handle_Client_Code_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Sortie_Dechet_Show handleBlur client_code ', value)
    const ret = await check_client_code(value)
    //consoleInfo('Sortie_Dechet_Show handle_Client_Code_Blur ret ', ret)
    set_client_code_forceOpen(false)
    if (ret === false) {
      set_client_code_forceOpen(true)
    }
  };

  const client_dechet_initialFilter: Filter<Client_Dechet_Type> = {
    code: sortie_Dechet.client_code
  };
	

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  
  

  const handle_Valide = async() => {
    if (sortie_Dechet.valide === 'O') {
      addNotification("Sortie déchets déjà validée", "error");
      return
    }
    setLoading(true)
    try {      
      const response  = await put_Sortie_Dechet(
        sortie_Dechet.numero,
        {
          numero:sortie_Dechet.numero,
          valide : 'O'
        }
      )
      const data : Sortie_Dechet_Type = await getResponseData(response, 'Sortie_Dechet_Show handle_Valider')
      //consoleInfo('Sortie_Dechet_Show handle_Valider data : ', data);
      set_Sortie_Dechet(data)
      addNotification("Sortie déchets validée", "success");
    }
    catch (err: any) {
      consoleInfo('Sortie_Dechet_Show handle_Valide err: ', err)
      handleError(String(err), err, addNotification)
      return false
    }
    finally {
      setLoading(false)
    }
  }

  const handle_Non_Valide = async() => {
    if (sortie_Dechet.valide === 'N') {
      addNotification("Sortie déchets déjà non validée", "error");
      return
    }
    setLoading(true)
    try {      
      const response  = await put_Sortie_Dechet(
        sortie_Dechet.numero,
        {
          numero:sortie_Dechet.numero,
          valide : 'N'
        }
      )
      const data : Sortie_Dechet_Type = await getResponseData(response, 'Sortie_Dechet_Show handle_Non_Valide')
      //consoleInfo('Sortie_Dechet_Show handle_Non_Valide data : ', data);
      set_Sortie_Dechet(data)
      addNotification("Sortie déchets dévalidée", "success");
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
    if (sortie_Dechet.valide === 'O') {
      addNotification("Sortie déchets déjà contrôlée", "error");
      return
    }
    setLoading(true)
    try {      
      const response  = await put_Sortie_Dechet(
        sortie_Dechet.numero,
        {
          numero:sortie_Dechet.numero,
          controle : 'O'
        }
      )
      const data : Sortie_Dechet_Type = await getResponseData(response, 'Sortie_Dechet_Show handle_Valider')
      //consoleInfo('Sortie_Dechet_Show handle_Valider data : ', data);
      set_Sortie_Dechet(data)
      addNotification("Sortie déchets contrôlée", "success");
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
    if (sortie_Dechet.valide === 'O') {
      addNotification("Sortie déchets déjà non contrôlée", "error");
      return
    }
    setLoading(true)
    try {      
      const response  = await put_Sortie_Dechet(
        sortie_Dechet.numero,
        {
          numero:sortie_Dechet.numero,
          controle : 'N'
        }
      )
      const data : Sortie_Dechet_Type = await getResponseData(response, 'Sortie_Dechet_Show handle_Non_Valide')
      //consoleInfo('Sortie_Dechet_Show handle_Non_Valide data : ', data);
      set_Sortie_Dechet(data)
      addNotification("Sortie déchets non contrôlée", "success");
    }
    catch (err) {
      handleError(String(err), err, addNotification)
      return false
    }
    finally {
      setLoading(false)
    }
  }

  const handle_Maj_Prix_Detail = () => {
    setMajPrixDetailOpen(true)
  }

  const handle_Print_Simple = async() : Promise<void> => {
    await sortie_Dechet_Show_Print_Simple(sortie_Dechet);
  };

  const { hasRole } = useAuth();

  const optionsMenu : React.ReactNode[] = [
    (hasRole('dbo.SORTIE_DECHET.VALIDER') && <ValiderMenu onClick={handle_Valide} />),
    (hasRole('dbo.SORTIE_DECHET.DEVALIDER') && <DevaliderMenu onClick={handle_Non_Valide} />),
    <Divider />,
    (hasRole('dbo.SORTIE_DECHET.CONTROLE') && <ControleMenu onClick={handle_Controle} />),
    (hasRole('dbo.SORTIE_DECHET.NON_CONTROLE') && <NonControleMenu onClick={handle_Non_Controle} />),
    <Divider />,
    (hasRole('dbo.SORTIE_DECHET.PRINT') && 
      <MenuItem onClick={handle_Print_Simple}>
        <ListItemIcon>
          <PrintIcon color="success"/>
        </ListItemIcon>
        Impression simple
      </MenuItem>    
    ),
    <Divider />,
    (hasRole('dbo.SORTIE_DECHET.MAJ_PRIX_DETAIL') && 
      <MenuItem onClick={handle_Maj_Prix_Detail}>
        <ListItemIcon>
          <SecurityUpdateIcon color="info"/>
        </ListItemIcon>
        Màj des prix détail
      </MenuItem>    
    )
  ]

  const handlePrint = async(data: Sortie_Dechet_Type) : Promise<void> => {
    await sortie_Dechet_Show_Print(data, user?.id);
  };

  return (
    <GenericShowPage<Sortie_Dechet_Type>
      tableName={ SORTIE_DECHET_TABLE_NAME }
      columns={sortie_Dechet_Columns}
			apiUrl={ SORTIE_DECHET_FETCH_URL}
      entityId={id}
      isEditMode={edit}
      loading={loading}
      optionsMenu={optionsMenu}
      setRemoteMode={setMode}
      setEditedEntity={ set_Sortie_Dechet }
      getDisplayName={(sortie_Dechet: Sortie_Dechet_Type) => 'Sortie déchets '+sortie_Dechet. numero}
      getId={(sortie_Dechet: Sortie_Dechet_Type) =>  sortie_Dechet.numero }
      getEditedEntity={() => sortie_Dechet }
      getNewEntity={get_New_Sortie_Dechet }
      getDuplicateEntity={get_Duplicate_Sortie_Dechet }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      onPrint={handlePrint}
      children={
        <>
          <TabContext value={value}>
            <MuiPKNumberField
              name="numero"
              label="Numéro"
              value={ sortie_Dechet.numero }
              fullWidth
              mode={mode}
              error={!!errors.numero }
              helperText={errors.numero }
              onChange={handleChange}
              onClear={() => set_Sortie_Dechet_Value("numero", "")} 
            />
            <TabList onChange={handleTabChange}>
              <Tab key={"1"} label='Sortie' value={"1"} />
              <Tab key={"2"} label='Lignes' value={"2"} />
              <Tab key={"3"} label='Détails' value={"3"} />
            </TabList>
            <Divider />
            <TabPanel key={"1"} value={"1"}>
              <ReferenceField 
                name="client_code"
                label="Client"
                value={ sortie_Dechet.client_code }
                fullWidth
                onChange={handleChange}
                onBlur={handle_Client_Code_Blur}
                error={!!errors.client_code }
                helperText={errors.client_code }
                mode={mode}
                onClear={() => set_Sortie_Dechet_Value('client_code', '')}  
                fieldName='code'
                setValue={function (value: any): void {
                  set_Client_Code(value);
                }}
                maxRows="md"
                DataTableComponent={ Client_Dechet_List_Modal }
                dataTableProps={{ initialFilter: client_dechet_initialFilter }}
                followUrl={`${ CLIENT_DECHET_URL}/${ sortie_Dechet.client_code }`}
                forceOpen={client_code_forceOpen}
              />
              <MuiTextField
                name="client_raison_sociale"
                label="Raison sociale"
                value={ sortie_Dechet.client_raison_sociale }
                fullWidth
                mode={mode}
                error={!!errors.client_raison_sociale }
                helperText={errors.client_raison_sociale }
                onChange={handleChange}
                onClear={() => set_Sortie_Dechet_Value("client_raison_sociale", "")}
              />
              <MuiDateTimePicker
                name="date_piece"
                label='Date sortie'
                value={dayjs(sortie_Dechet.date_piece)}
                onChange={(date) => set_Sortie_Dechet_Value('date_piece', date)}
                mode={mode}
                onClear={() => set_Sortie_Dechet_Value("date_piece", null)}
                error={!!errors.date_piece }
                helperText={errors.date_piece }
                format="DD/MM/YYYY"
              />
              <MuiNumberField
                name="montant"
                label="Montant"
                fractionDigits={2}
                value={ sortie_Dechet.montant }
                fullWidth
                error={!!errors.montant }
                helperText={errors.montant }
                mode="Browse"
                onClear={() => set_Sortie_Dechet_Value('montant', '')}
              />
              <MuiNumberField
                name="montant_regle"
                label="Montant réglé"
                fractionDigits={2}
                value={ sortie_Dechet.montant_regle }
                fullWidth
                error={!!errors.montant_regle }
                helperText={errors.montant_regle }
                mode="Browse"
              />
              <MuiSwitch
                name="valide"
                label="Validé"
                value={sortie_Dechet.valide}
                onChange={(e) => set_Sortie_Dechet_Value('valide', e.target.checked ? "O" : "N")}
                error={!!errors.valide}
                helperText={errors.valide}
                mode="Browse"
                checked={sortie_Dechet.valide === "O"}
              />
              <br/>
              <MuiSwitch
                name="controle"
                label="Contrôlé"
                value={sortie_Dechet.controle}
                onChange={(e) => set_Sortie_Dechet_Value('controle', e.target.checked ? "O" : "N")}
                error={!!errors.controle}
                helperText={errors.controle}
                mode="Browse"
                checked={sortie_Dechet.controle === "O"}
              />
					  </TabPanel>
            <TabPanel key={"2"} value={"2"}>
              <Sortie_Dechet_Ligne_Child />
            </TabPanel>
            <TabPanel key={"3"} value={"3"}>
              <Sortie_Dechet_Detail_Child />
            </TabPanel>
          </TabContext>
          <Sortie_Dechet_Maj_Prix_Detail 
            numero={sortie_Dechet.numero}
            open={majPrixDetailOpen}
            onClose={() => setMajPrixDetailOpen(false)}
          />
        </>
      }
    />
  );
};

export default Sortie_Dechet_Show;