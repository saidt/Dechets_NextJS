"use client";

import {
  Empty_Versement_Dechet, 
  VERSEMENT_DECHET_FETCH_URL, 
  VERSEMENT_DECHET_TABLE_NAME, 
  versement_Dechet_Schema, 
  Versement_Dechet_Type,
  versement_Dechet_Columns
} from "@/types/versement-dechet";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { Mode } from "@/lib/types";
import { useEffect, useState } from "react";
import { MuiCheckbox, MuiDateTimePicker, MuiPKNumberField, MuiPKTextField } from "@/components/form-show/Inputs";
import { useParams, useSearchParams } from "next/navigation";
import dayjs from "dayjs";

import { Divider, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import Versement_Dechet_Ligne_List from "./Versement_Dechet_Ligne_List";
import useAuth from "@/app/context/UseAuth";
import { DevaliderMenu, ValiderMenu } from "@/components/ui/menu/Menus";
import { getResponseData } from "@/lib/html";
import { consoleInfo } from "@/lib/clientLog";
import { handleError } from "@/lib/error";
import { useAppContext } from "@/app/context/AppContext";
import { put_Versement_Dechet } from "@/fetch/versement-dechet";

const TAB_STORAGE_KEY = "VERSEMENT_DECHET_TAB";

// Declared at module level (not inside Versement_Dechet_Show) so each keeps the same
// component identity across re-renders: a component declared inside another
// one is a new type on every render, which remounts it (list reloaded, state
// lost) and, on an API error, re-notifies in an endless loop.
// Per-render values (filters) are passed through ReferenceField dataTableProps.
const Versement_Dechet_Ligne_Child = () => (
  <Versement_Dechet_Ligne_List isModalList={false} />
);

const Versement_Dechet_Show = () => {
  //const { addNotification } = useAppContext();

  const { id } = useParams<{ id: string }>();
  //consoleInfo('Versement_Dechet_Show idParam: ', id)

  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Versement_Dechet_Show edit: ', edit)

  const [versement_Dechet, set_Versement_Dechet] = useState<Versement_Dechet_Type>(Empty_Versement_Dechet);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Versement_Dechet_Type, string>>>({});
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(sessionStorage.getItem(TAB_STORAGE_KEY) || "1");

  function validate(versement_Dechet: Versement_Dechet_Type) : boolean {    
    const result = versement_Dechet_Schema.safeParse(versement_Dechet);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Versement_Dechet_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const get_New_Versement_Dechet = () => {
    const newEntity : Versement_Dechet_Type = Empty_Versement_Dechet
    return newEntity
  }

  const get_Duplicate_Versement_Dechet = () => {
    const { numero, ...rest } : Versement_Dechet_Type = versement_Dechet;
    const dupEntity : Versement_Dechet_Type = { numero:0, ...rest}
    //consoleInfo('Versement_Dechet_Show getDuplicateVersement_Dechet dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (versement_Dechet : Versement_Dechet_Type, modifiedVersement_Dechet : Partial<Versement_Dechet_Type>) : Partial<Versement_Dechet_Type> => {
    const modifiedWithId={ numero: versement_Dechet.numero, ...modifiedVersement_Dechet};
    return modifiedWithId
  }

  function set_Versement_Dechet_Value(name: string, value: any) {
    //consoleInfo('Versement_Dechet_Show set_Versement_Dechet_Value name/value ', name, '/', value)
    set_Versement_Dechet((prevVersement_Dechet) => ({
      ...prevVersement_Dechet,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_Versement_Dechet_Value(name, value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    sessionStorage.setItem(TAB_STORAGE_KEY, value);
  }, [value]);


  const { addNotification } = useAppContext();

  const handle_Valide = async() => {
    if (versement_Dechet.valide === 'O') {
      addNotification("Versement déchets déjà validé", "warning");
      return
    }
    setLoading(true)
    try {      
      const response  = await put_Versement_Dechet(
        versement_Dechet.numero,
        {
          numero:versement_Dechet.numero,
          valide : 'O'
        }
      )
      const data : Versement_Dechet_Type = await getResponseData(response, 'Versement_Dechet_Show handle_Valider')
      //consoleInfo('Versement_Dechet_Show handle_Valider data : ', data);
      set_Versement_Dechet(data)
      addNotification("Versement déchets validé", "success");
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
    if (versement_Dechet.valide === 'N') {
      addNotification("Versement déchets déjà non validé", "warning");
      return
    }
    setLoading(true)
    try {      
      const response  = await put_Versement_Dechet(
        versement_Dechet.numero,
        {
          numero:versement_Dechet.numero,
          valide : 'N'
        }
      )
      const data : Versement_Dechet_Type = await getResponseData(response, 'Versement_Dechet_Show handle_Non_Valide')
      //consoleInfo('Versement_Dechet_Show handle_Non_Valide data : ', data);
      set_Versement_Dechet(data)
      addNotification("Versement déchets non validé", "success");
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
    (hasRole('dbo.VERSEMENT_DECHET.VALIDER') && <ValiderMenu onClick={handle_Valide} />),
    (hasRole('dbo.VERSEMENT_DECHET.DEVALIDER') && <DevaliderMenu onClick={handle_Non_Valide} />),
  ]

  return (
    <GenericShowPage<Versement_Dechet_Type>
      tableName={ VERSEMENT_DECHET_TABLE_NAME }
      columns={versement_Dechet_Columns}
      apiUrl={ VERSEMENT_DECHET_FETCH_URL}
      entityId={id}
      isEditMode={edit}
      loading={loading}
      optionsMenu={optionsMenu}
      setRemoteMode={setMode}
      setEditedEntity={ set_Versement_Dechet }
      getDisplayName={(versement_Dechet: Versement_Dechet_Type) => 'Versement déchets '+versement_Dechet. numero}
      getId={(versement_Dechet: Versement_Dechet_Type) =>  versement_Dechet.numero }
      getEditedEntity={() => versement_Dechet }
      getNewEntity={get_New_Versement_Dechet }
      getDuplicateEntity={get_Duplicate_Versement_Dechet }
      getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
				  <TabContext value={value}>
            <TabList
              onChange={handleTabChange} 
              sx={{
                "& .Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  borderRadius: 1,
                },
              }}
            >
              <Tab key={"1"} label='Versement' value={"1"} />
              <Tab key={"2"} label='Lignes' value={"2"} />
            </TabList>
            <Divider />
            <TabPanel key={"1"} value={"1"}>
              <MuiPKNumberField
                name="numero"
                label="Numéro"
                value={ versement_Dechet.numero }
                fullWidth
                mode={mode}
                error={!!errors.numero }
                helperText={errors.numero }
                onChange={handleChange}
                onClear={() => set_Versement_Dechet_Value("numero", "")} 
              />
              <MuiDateTimePicker
                name="date_piece"
                label='Date'
                value={dayjs(versement_Dechet.date_piece)}
                onChange={(date) => set_Versement_Dechet_Value('date_piece', date)}
                mode={mode}
                onClear={() => set_Versement_Dechet_Value("date_piece", null)}
                error={!!errors.date_piece }
                helperText={errors.date_piece }
                format="DD/MM/YYYY"
              />
              <MuiCheckbox
                name="valide"
                label="Validé"
                value={versement_Dechet.valide}
                onChange={(e) => set_Versement_Dechet_Value('valide', e.target.checked ? "O" : "N")}
                error={!!errors.valide}
                helperText={errors.valide}
                mode="Browse"
                checked={versement_Dechet.valide === "O"}
              />
            </TabPanel>
            <TabPanel key={"2"} value={"2"}>
              <Versement_Dechet_Ligne_Child />
            </TabPanel>
          </TabContext>
        </>
      }
    />
  );
};

export default Versement_Dechet_Show;