"use client";

import { Empty_Client_Dechet, CLIENT_DECHET_FETCH_URL, CLIENT_DECHET_TABLE_NAME, client_Dechet_Schema, Client_Dechet_Type, client_Dechet_Columns } from "@/types/client-dechet";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { Mode } from "@/lib/types";
import { useEffect, useState } from "react";
import { MuiPKTextField, MuiTextField } from "@/components/form-show/Inputs";
import { useParams, useSearchParams } from "next/navigation";
import { Stored_Proc_Param_Type } from "@/types/sp";
import { formatDateTime } from "@/lib/date-utils";
import useAuth from "@/app/context/UseAuth";
import { StatistiqueMenu } from "@/components/ui/menu/Menus";
import PeriodeDialog from "@/components/ui/dialog/PeriodeDialog";
import Stored_Proc_List from "../sp/Stored_Proc_List";
import { ListItemIcon, MenuItem, MenuItemProps } from "@mui/material";
import LockResetIcon from '@mui/icons-material/LockReset';
import BalanceIcon from '@mui/icons-material/Balance';
import { useAppContext } from "@/app/context/AppContext";
import { handleError } from "@/lib/error";
import { fetchPeriode, PeriodeResultType } from "@/lib/periode";

const Client_Dechet_Show = () => {

  const [client_Dechet, setClient_Dechet] = useState<Client_Dechet_Type>(Empty_Client_Dechet);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Client_Dechet_Type, string>>>({});

  const [dateDeb, setDateDeb] = useState<Date | null>(new Date());
  const [dateFin, setDateFin] = useState<Date | null>(new Date());
  const [spName, setSpName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [params, setParams] = useState<Stored_Proc_Param_Type[]>([]);
  
  const [periodeOpen, setPeriodeOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { addNotification } = useAppContext();

  const { id } = useParams<{ id: string }>();
  //consoleInfo('Client_DechetShowPage idParam: ', id)

  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Client_Dechet_Show edit: ', edit)

  function validate(client_Dechet: Client_Dechet_Type) : boolean {    
    const result = client_Dechet_Schema.safeParse(client_Dechet);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Client_Dechet_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const getNewClient_Dechet = () => {
    const newEntity : Client_Dechet_Type = Empty_Client_Dechet
    return newEntity
  }

  const getDuplicateClient_Dechet = () => {
    const { code, ...rest } : Client_Dechet_Type = client_Dechet;
    const dupEntity : Client_Dechet_Type = { code:'', ...rest}
    //consoleInfo('Client_Dechet_Show getDuplicateClient_Dechet dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (client_Dechet : Client_Dechet_Type, modifiedClient_Dechet : Partial<Client_Dechet_Type>) : Partial<Client_Dechet_Type> => {
    const modifiedWithId={ code: client_Dechet.code, ...modifiedClient_Dechet};
    return modifiedWithId
  }

  function setClient_DechetValue(name: string, value: any) {
    //consoleInfo('Client_Dechet_Show setClient_DechetValue name/value ', name, '/', value)
    setClient_Dechet((prevClient_Dechet) => ({
      ...prevClient_Dechet,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setClient_DechetValue(name, value);
  };

  const BouclageMenu = (props : MenuItemProps) => {
    return (
      <MenuItem {...props}>
        <ListItemIcon>
          <LockResetIcon color="secondary"/>
        </ListItemIcon>
        Bouclage des déchets
      </MenuItem>    
    );
  };

  const SoldeResumeMenu = (props : MenuItemProps) => {
    return (
      <MenuItem {...props}>
        <ListItemIcon>
          <BalanceIcon color="secondary"/>
        </ListItemIcon>
        Solde résumé
      </MenuItem>    
    );
  };

  const SoldeDetailMenu = (props : MenuItemProps) => {
    return (
      <MenuItem {...props}>
        <ListItemIcon>
          <BalanceIcon color="secondary"/>
        </ListItemIcon>
        Solde détail
      </MenuItem>    
    );
  };

  const handle_Stat_Un_Detail = () => {
    setSpName("dbo.STAT_SORTIE_DECHET_CLIENT_UN_DETAIL")
    setPeriodeOpen(true)
  };

  const handle_Bouclage = () => {
    setSpName("dbo.SORTIE_DECHET_BOUCLAGE")
    setPeriodeOpen(true)
  };

  const handle_Solde_Resume = () => {
    setSpName("dbo.CLIENT_DECHET_SOLDE_SOR_RESUME")
    setTitle(
      `Solde résumé des sorties déchets ${client_Dechet.code}`
    );
    setParams([
      {name: "Code", value: client_Dechet.code},
    ])
    setStatsOpen(true)
  };

  const handle_Solde_Detail = () => {
    setSpName("dbo.CLIENT_DECHET_SOLDE_SOR_DETAIL")
    setTitle(
      `Solde détail des sorties déchets ${client_Dechet.code}`
    );
    setParams([
      {name: "Code", value: client_Dechet.code},
    ])
    setStatsOpen(true)
  };

  const { hasRole } = useAuth();

  const optionsMenu : React.ReactNode[] = [
    (hasRole("dbo.STAT_SORTIE_DECHET_CLIENT_UN_DETAIL.EXEC") && 
      <StatistiqueMenu caption="Statistiques des sorties déchets un (détail)"
        onClick={handle_Stat_Un_Detail} />),
    (hasRole("dbo.SORTIE_DECHET_BOUCLAGE.EXEC") &&
      client_Dechet.code === 'GUESSOUSS' &&
      <BouclageMenu onClick={handle_Bouclage} />),
    (hasRole("dbo.CLIENT_DECHET_SOLDE_SOR_RESUME.EXEC") && 
      client_Dechet.code === 'GUESSOUSS' &&
      <SoldeResumeMenu onClick={handle_Solde_Resume} />),
    (hasRole("dbo.CLIENT_DECHET_SOLDE_SOR_DETAIL.EXEC") && 
      client_Dechet.code === 'GUESSOUSS' &&
      <SoldeDetailMenu onClick={handle_Solde_Detail} />)
  ]

  const handle_Execute_Periode = () => {
    if (spName === "dbo.STAT_SORTIE_DECHET_CLIENT_UN_DETAIL") {
      setTitle(
        `Statistiques des sorties déchets du client ${client_Dechet.code}
        du ${dateDeb ? formatDateTime(dateDeb) : ''}
        au ${dateFin ? formatDateTime(dateFin) : ''}`
      );
      setParams([
        {name: "ClientCode", value: client_Dechet.code},
        {name: "DateDeb", value: dateDeb},
        {name: "DateFin", value: dateFin}
      ])
    }
    else if (spName === "dbo.SORTIE_DECHET_BOUCLAGE") {
      setTitle(
        `Bouclage des déchets du client ${client_Dechet.code}
        du ${dateDeb ? formatDateTime(dateDeb) : ''}
        au ${dateFin ? formatDateTime(dateFin) : ''}`
      );
      setParams([
        {name: "ClientCode", value: client_Dechet.code},
        {name: "DateDeb", value: dateDeb},
        {name: "DateFin", value: dateFin}
      ])
    }
    setStatsOpen(true)
  };

  useEffect(() => {
    async function fetch_Periode() {
      setLoading(true);
      try {
        const result : PeriodeResultType = await fetchPeriode();
        if (result.error) {
          addNotification(result.error, "error");
        }
        else {
          setDateDeb(result.dateDeb);
          setDateFin(result.dateFin);
        }
      }
      catch (err) {
        handleError("Client_Dechet_Show fetch_Periode failed", err, addNotification);
      }
      finally {
        setLoading(false);
      }
    }
    fetch_Periode();
  }, []);

  const Periode_Page = () => (
    <PeriodeDialog
      open={periodeOpen}
      onClose={() => setPeriodeOpen(false)}
      dateDeb={dateDeb}
      dateFin={dateFin}
      setDateDeb={setDateDeb} 
      setDateFin={setDateFin}
      onExecuteClick={handle_Execute_Periode}
    />
  )

  const Stats_Page = () => (
    <Stored_Proc_List
      spName={spName}
      open={statsOpen}
      onClose={() => setStatsOpen(false)}
      title={title}
      params={params}
    />
  )

  return (
    <>
      <GenericShowPage<Client_Dechet_Type>
        tableName={ CLIENT_DECHET_TABLE_NAME }
        columns={client_Dechet_Columns}
        apiUrl={ CLIENT_DECHET_FETCH_URL}
        entityId={id}
        isEditMode={edit}
        optionsMenu={optionsMenu}
        setRemoteMode={setMode}
        loading={loading}
        setEditedEntity={ setClient_Dechet }
        getDisplayName={(client_Dechet: Client_Dechet_Type) => 'Client déchets '+client_Dechet. code}
        getId={(client_Dechet: Client_Dechet_Type) =>  client_Dechet.code }
        getEditedEntity={() => client_Dechet }
        getNewEntity={getNewClient_Dechet }
        getDuplicateEntity={getDuplicateClient_Dechet }
        getModifiedWithId={getModifiedWithId}
        validate={validate}
        children={
          <>
            <MuiPKTextField
              name="code"
              label="Code"
              value={ client_Dechet.code }
              fullWidth
              mode={mode}
              error={!!errors.code }
              helperText={errors.code }
              onChange={handleChange}
              onClear={() => setClient_DechetValue("code", "")} 
            />
            <MuiTextField
              name="raison_sociale"
              label="Raison sociale"
              value={ client_Dechet.raison_sociale }
              fullWidth
              mode={mode}
              error={!!errors.raison_sociale }
              helperText={errors.raison_sociale }
              onChange={handleChange}
              onClear={() => setClient_DechetValue("raison_sociale", "")}
            />
          </>
        }
      />
      <Periode_Page />
      <Stats_Page />
    </>
  );
};

export default Client_Dechet_Show;