"use client";
import { apiFetch } from "@/lib/apiFetch";

import {
  Empty_Envoi_Frs_Dechet,
  envoi_Frs_Dechet_Columns,
  ENVOI_FRS_DECHET_FETCH_URL,
  ENVOI_FRS_DECHET_SHOW_TITLE,
  ENVOI_FRS_DECHET_TABLE_NAME,
  envoi_Frs_Dechet_Schema,
  Envoi_Frs_Dechet_Type, 
  ENVOI_FRS_DECHET_URL
} from "@/types/envoi-frs-dechet";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { Mode } from "@/lib/types";
import { useState } from "react";
import { MuiDateTimePicker, MuiNumberField, MuiPKNumberField, MuiSwitch, MuiTextField } from "@/components/form-show/Inputs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import Envoi_Frs_Dechet_Reste, { Envoi_Frs_Dechet_Reste_Type } from "./Envoi_Frs_Dechet_Reste";
import useAuth from "@/app/context/UseAuth";
import { DevaliderMenu, ImporterMenu, ValiderMenu } from "@/components/ui/menu/Menus";
import MuiDialog from "@/components/ui/dialog/MuiDialog";
import { DialogProps, Divider } from "@mui/material";
import { getResponseData } from "@/lib/html";
import { useAppContext } from "@/app/context/AppContext";
import { handleError } from "@/lib/error";
import { put_Envoi_Frs_Dechet } from "@/fetch/envoi-frs-dechet";
//import { consoleDebug, consoleInfo } from "@/lib/clientLog";

const Envoi_Frs_Dechet_Show = () => {
  const { addNotification } = useAppContext();

  const { id } = useParams<{ id: string }>();
  //consoleDebug('Envoi_Frs_Dechet_Show idParam: ', id)
  
  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleDebug('Envoi_Frs_Dechet_Show edit: ', edit)

  const [envoi_Frs_Dechet, set_Envoi_Frs_Dechet] = useState<Envoi_Frs_Dechet_Type>(Empty_Envoi_Frs_Dechet);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Envoi_Frs_Dechet_Type, string>>>({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate(envoi_Frs_Dechet: Envoi_Frs_Dechet_Type) : boolean {    
    const result = envoi_Frs_Dechet_Schema.safeParse(envoi_Frs_Dechet);
    //consoleDebug('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleDebug('Envoi_Frs_Dechet_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const get_New_Envoi_Frs_Dechet = () => {
    const newEntity : Envoi_Frs_Dechet_Type = Empty_Envoi_Frs_Dechet
    return newEntity
  }

  const get_Duplicate_Envoi_Frs_Dechet = () => {
    const { id, ...rest } : Envoi_Frs_Dechet_Type = envoi_Frs_Dechet;
    const dupEntity : Envoi_Frs_Dechet_Type = { id:0, ...rest}
    //consoleDebug('Envoi_Frs_Dechet_Show getDuplicateEnvoi_Frs_Dechet dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (envoi_Frs_Dechet : Envoi_Frs_Dechet_Type, modifiedEnvoi_Frs_Dechet : Partial<Envoi_Frs_Dechet_Type>) : Partial<Envoi_Frs_Dechet_Type> => {
    const modifiedWithId={ id: envoi_Frs_Dechet.id, ...modifiedEnvoi_Frs_Dechet};
    return modifiedWithId
  }

  function set_Envoi_Frs_Dechet_Value(name: string, value: any) {
    //consoleDebug('Envoi_Frs_Dechet_Show set_Envoi_Frs_Dechet_Value name/value ', name, '/', value)
    set_Envoi_Frs_Dechet((prevEnvoi_Frs_Dechet) => ({
      ...prevEnvoi_Frs_Dechet,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_Envoi_Frs_Dechet_Value(name, value);
  };

  const handle_Import = () => {
    if (! hasRole('dbo.ENVOI_FRS_DECHET.ADD')) {
      return
    }
    setMode('Create')
    setOpen(true)
  }

  const handle_Close = () => {
    setOpen(false)
  }

  const handle_Valide = async() => {
    if (envoi_Frs_Dechet.valide === 'O') {
      addNotification("Envoi déchets au fournisseur déjà validé", "warning");
      return
    }
    setLoading(true)
    try {
      const response  = await put_Envoi_Frs_Dechet(
        envoi_Frs_Dechet.id,
        {
          id: envoi_Frs_Dechet.id,
          valide : 'O'
        }
      )
      const data : Envoi_Frs_Dechet_Type = await getResponseData(response, 'Envoi_Frs_Dechet_Show handle_Valider')
      //consoleInfo('Reglement_Dechet_Show handle_Valider data : ', data);
      set_Envoi_Frs_Dechet(data)
      addNotification("Envoi déchets au fournisseur validé", "success");
    }
    catch (err: any) {
      //consoleInfo('Envoi_Frs_Dechet_Show handle_Valide err: ', err)
      handleError(String(err), err, addNotification)
      return false
    }
    finally {
      setLoading(false)
    }
  }

  const handle_Non_Valide = async() => {
    if (envoi_Frs_Dechet.valide === 'N') {
      addNotification("Envoi déchets au fournisseur déjà non validé", "warning");
      return
    }
    setLoading(true)
    try {      
      const response  = await put_Envoi_Frs_Dechet(
        envoi_Frs_Dechet.id,
        {
          id: envoi_Frs_Dechet.id,
          valide : 'N'
        }
      )
      const data : Envoi_Frs_Dechet_Type = await getResponseData(response, 'Envoi_Frs_Dechet_Show handle_Non_Valide')
      //consoleInfo('Envoi_Frs_Dechet_Show handle_Non_Valide data : ', data);
      set_Envoi_Frs_Dechet(data)
      addNotification("Envoi déchets au fournisseur non validé", "success");
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
    (hasRole('dbo.ENVOI_FRS_DECHET.ADD') && <ImporterMenu onClick={handle_Import} />),
    <Divider />,
    (hasRole('dbo.ENVOI_FRS_DECHET.VALIDER') && <ValiderMenu onClick={handle_Valide} />),
    (hasRole('dbo.ENVOI_FRS_DECHET.DEVALIDER') && <DevaliderMenu onClick={handle_Non_Valide} />),
  ]

  const router =  useRouter()

  const handleRowClick = async(row: Envoi_Frs_Dechet_Reste_Type) => {
    const newEnvoi = {
      ...Empty_Envoi_Frs_Dechet,
      annee: row.ANNEE,
      no_dos_exp: row.NO_DOS_EXP,
      no_cmd_exp: row.NO_CMD_EXP,
      date_cmd: row.DATE_CMD,
      article_code: row.ARTICLE_CODE,
      quantite: row.QUANTITE,
    };
     
    set_Envoi_Frs_Dechet(newEnvoi);

    setOpen(false);    
    //consoleInfo('Envoi_Frs_Dechet_Show handleRowClick newEnvoi ', newEnvoi)

    setLoading(true);
    try {
      const response  = await apiFetch(`${ENVOI_FRS_DECHET_FETCH_URL}/null`, {
        method: "POST",
        //headers: {'Content-Type': 'application/json' },
        //credentials: 'include',
        body: JSON.stringify({
          data: newEnvoi,
        }),
      });
  
      const newEntity = await getResponseData(response, 'Envoi_Frs_Dechet_Show handleRowClick')
      //consoleInfo('Envoi_Frs_Dechet_Show handleRowClick newEntity ', newEntity)
      addNotification("Entity created", "success");
      const newId = newEntity.id
      router.replace(`${ENVOI_FRS_DECHET_URL}/${newId}`);
    }
    catch (err: any) {
      handleError('Save failed', err, addNotification)
    } 
    finally {
      setLoading(false);
    }
  };
	

  return (
    <GenericShowPage<Envoi_Frs_Dechet_Type>
      tableName={ ENVOI_FRS_DECHET_TABLE_NAME }
	    columns={ envoi_Frs_Dechet_Columns }
      apiUrl={ ENVOI_FRS_DECHET_FETCH_URL}
      entityId={id}
      isEditMode={edit}
      optionsMenu={optionsMenu}
      loading={loading}
      setRemoteMode={setMode}
      setEditedEntity={ set_Envoi_Frs_Dechet }
      getDisplayName={(envoi_Frs_Dechet: Envoi_Frs_Dechet_Type) => ENVOI_FRS_DECHET_SHOW_TITLE+" "+envoi_Frs_Dechet. id}
      getId={(envoi_Frs_Dechet: Envoi_Frs_Dechet_Type) =>  envoi_Frs_Dechet.id }
      getEditedEntity={() => envoi_Frs_Dechet }
      getNewEntity={get_New_Envoi_Frs_Dechet }
      getDuplicateEntity={get_Duplicate_Envoi_Frs_Dechet }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <MuiPKNumberField
            name="id"
            label="Id"
            value={ envoi_Frs_Dechet.id }
            fullWidth
            mode={'Browse'}
            error={!!errors.id }
            helperText={errors.id }
            onChange={handleChange}
            onClear={() => set_Envoi_Frs_Dechet_Value("id", "")} 
          />
          <MuiNumberField
            name="annee"
            label="Année"
            value={ envoi_Frs_Dechet.annee }
            fullWidth
            onChange={handleChange}
            error={!!errors.annee }
            helperText={errors.annee }
            mode={'Browse'}
            onClear={() => set_Envoi_Frs_Dechet_Value('annee', '')}
          />
          <MuiNumberField
            name="no_dos_exp"
            label="N° dossier"
            value={ envoi_Frs_Dechet.no_dos_exp }
            fullWidth
            onChange={handleChange}
            error={!!errors.no_dos_exp }
            helperText={errors.no_dos_exp }
            mode={'Browse'}
            onClear={() => set_Envoi_Frs_Dechet_Value('no_dos_exp', '')}
          />
          <MuiNumberField
            name="no_cmd_exp"
            label="N° commande"
            value={ envoi_Frs_Dechet.no_cmd_exp }
            fullWidth
            onChange={handleChange}
            error={!!errors.no_cmd_exp }
            helperText={errors.no_cmd_exp }
            mode={'Browse'}
            onClear={() => set_Envoi_Frs_Dechet_Value('no_cmd_exp', '')}
          />
          <MuiDateTimePicker
            name="date_cmd"
            label='Date Cmd'
            value={dayjs(envoi_Frs_Dechet.date_cmd)}
            onChange={(date) => set_Envoi_Frs_Dechet_Value('date_cmd', date)}
            mode={'Browse'}
            onClear={() => set_Envoi_Frs_Dechet_Value("date_cmd", null)}
            error={!!errors.date_cmd }
            helperText={errors.date_cmd }
            format="DD/MM/YYYY"
          />
          <MuiTextField 
            name="article_code"
            label="Article"
            value={ envoi_Frs_Dechet.article_code }
            fullWidth
            error={!!errors.article_code }
            helperText={errors.article_code }
            mode={'Browse'}
            onClear={() => set_Envoi_Frs_Dechet_Value('article_code', '')}  
          />
          <MuiNumberField
            name="quantite"
            label="Quantité"
            value={ envoi_Frs_Dechet.quantite }
            fullWidth
            onChange={handleChange}
            error={!!errors.quantite }
            helperText={errors.quantite }
            mode={'Browse'}
            onClear={() => set_Envoi_Frs_Dechet_Value('quantite', 0)}
          />
          <MuiSwitch
              name="valide"
              label="Validé"
              value={envoi_Frs_Dechet.valide}
              onChange={(e) => set_Envoi_Frs_Dechet_Value('valide', e.target.checked ? "O" : "N")}
              error={!!errors.valide}
              helperText={errors.valide}
              mode="Browse"
              checked={envoi_Frs_Dechet.valide === "O"}
            />
          <MuiDialog
            open={open}
            onClose={handle_Close}
            title="Choisir un article"
            children={
              <Envoi_Frs_Dechet_Reste
                isModalList={true}
                onRowClick={handleRowClick}
              />
            }
          />
        </>
      }
    />
  );
};

export default Envoi_Frs_Dechet_Show;