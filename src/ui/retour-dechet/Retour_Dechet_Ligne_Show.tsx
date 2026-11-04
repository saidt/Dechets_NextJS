"use client";

import {
  Empty_Retour_Dechet_Ligne,
  RETOUR_DECHET_LIGNE_CHILD_URL,
  RETOUR_DECHET_LIGNE_TABLE_NAME,
  retour_Dechet_Ligne_Schema,
  Retour_Dechet_Ligne_Type,
  retour_Dechet_Ligne_Columns,
} from "@/types/retour-dechet-ligne";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { CmListProps, Filter, Mode } from "@/lib/types";
import { useState } from "react";
import { MuiPKTextField, MuiTextField } from "@/components/form-show/Inputs";
import { ReferenceField } from "@/components/form-show/ReferenceField";
import { useParams, useSearchParams } from "next/navigation";
import { getResponseData } from "@/lib/html";
import { Article_Type, ARTICLE_URL } from "@/types/article";
import Article_List from "../article/Article_List";
import { Unite_Type, UNITE_URL } from "@/types/unite";
import Unite_List from "../unite/Unite_List";
import { RETOUR_DECHET_FETCH_URL } from "@/types/retour-dechet";
import { fetch_Article } from "@/fetch/article";
import { fetch_Unite } from "@/fetch/unite";
import { useAppContext } from "@/app/context/AppContext";
import { handleError } from "@/lib/error";
//import { consoleInfo } from "@/lib/log";

// Declared at module level (not inside Retour_Dechet_Ligne_Show) so each keeps the same
// component identity across re-renders: a component declared inside another
// one is a new type on every render, which remounts it (list reloaded, state
// lost) and, on an API error, re-notifies in an endless loop.
// Per-render values (filters) are passed through ReferenceField dataTableProps.
const Article_List_Modal = (props: CmListProps<Article_Type>) => (
  <Article_List {...props} isModalList={true} />
);

const Unite_List_Modal = (props: CmListProps<Unite_Type>) => (
  <Unite_List {...props} isModalList={true} />
);

const Retour_Dechet_Ligne_Show = () => {
  const { addNotification } = useAppContext();
  const { id, childId } = useParams<{ id: string; childId: string }>();

  //consoleInfo('Retour_Dechet_Ligne_Show id Param: ', id)
  //consoleInfo('Retour_Dechet_Ligne_Show childId Param: ', childId)

  const empty_Retour_Dechet_Ligne = Empty_Retour_Dechet_Ligne;
  empty_Retour_Dechet_Ligne.retour_dechet_numero = Number(id)
	
  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Retour_Dechet_Ligne_Show edit: ', edit)

  const [retour_Dechet_Ligne, set_Retour_Dechet_Ligne] = useState<Retour_Dechet_Ligne_Type>(empty_Retour_Dechet_Ligne);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Retour_Dechet_Ligne_Type, string>>>({});
  const [article_code_forceOpen, set_article_code_forceOpen] = useState<boolean>(false);
  const [unite_forceOpen, set_unite_forceOpen] = useState<boolean>(false);

  function validate(retour_Dechet_Ligne: Retour_Dechet_Ligne_Type) : boolean {    
    const result = retour_Dechet_Ligne_Schema.safeParse(retour_Dechet_Ligne);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Retour_Dechet_Ligne_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const get_New_Retour_Dechet_Ligne = () => {
    const newEntity : Retour_Dechet_Ligne_Type = Empty_Retour_Dechet_Ligne
    return newEntity
  }

  const get_Duplicate_Retour_Dechet_Ligne = () => {
    const { id, ...rest } : Retour_Dechet_Ligne_Type = retour_Dechet_Ligne;
    const dupEntity : Retour_Dechet_Ligne_Type = { id:0, ...rest}
    //consoleInfo('Retour_Dechet_Ligne_Show getDuplicateRetour_Dechet_Ligne dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (retour_Dechet_Ligne : Retour_Dechet_Ligne_Type, modifiedRetour_Dechet_Ligne : Partial<Retour_Dechet_Ligne_Type>) : Partial<Retour_Dechet_Ligne_Type> => {
    const modifiedWithId={ id: retour_Dechet_Ligne.id, ...modifiedRetour_Dechet_Ligne};
    return modifiedWithId
  }

  function set_Retour_Dechet_Ligne_Value(name: string, value: any) {
    //consoleInfo('Retour_Dechet_Ligne_Show set_Retour_Dechet_Ligne_Value name/value ', name, '/', value)
    set_Retour_Dechet_Ligne((prevRetour_Dechet_Ligne) => ({
      ...prevRetour_Dechet_Ligne,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_Retour_Dechet_Ligne_Value(name, value);
  };
	
	const check_article_code = async(value: string) : Promise<boolean> =>{
    try {
      const response = await fetch_Article(value)
      const data : Article_Type = await getResponseData(response, 'check_article_code api error')
      //consoleInfo('Retour_Dechet_Ligne_Show check_article_code data ', data)

      if (! data) {
        set_Retour_Dechet_Ligne_Value('article_designation', '');
        set_Retour_Dechet_Ligne_Value('unite', '');
        return false
      }
      else {
        set_Retour_Dechet_Ligne_Value('article_designation', data.designation);
        set_Retour_Dechet_Ligne_Value('unite', data.unite_stk);
        return true
      }
    }
    catch (err) {
      handleError('check_article_code api error', err, addNotification)
      return false
    }
  };
	
  async function set_Article_Code(value: string) {
    //consoleInfo('Retour_Dechet_Ligne_Show set_article_code value ', value)
    set_Retour_Dechet_Ligne_Value('article_code', value);
    const ret = await check_article_code(value)
    //consoleInfo('Retour_Dechet_Ligne_Show set_article_code ret ', ret)
    set_article_code_forceOpen(false)
    if (ret === false) {
      set_article_code_forceOpen(true)
    }
  }

  const handle_Article_Code_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Retour_Dechet_Ligne_Show handleBlur article_code ', value)
    const ret = await check_article_code(value)
    //consoleInfo('Retour_Dechet_Ligne_Show handle_Article_Code_Blur ret ', ret)
    set_article_code_forceOpen(false)
    if (ret === false) {
      set_article_code_forceOpen(true)
    }
  };

  const article_initialFilter: Filter<Article_Type> = {
    code: retour_Dechet_Ligne.article_code
  };

  const articlePermanentFilter: Filter<Article_Type> = {
    nature: 'DECHET',
  };

  
	const check_unite = async(value: string) : Promise<boolean> =>{
    try {
      const response = await fetch_Unite(value)
      const data : Unite_Type = await getResponseData(response, 'check_unite api error')
      //consoleInfo('Retour_Dechet_Ligne_Show check_unite data ', data)

      if (! data) {
        return false
      }
      else {
        return true
      }
    }
    catch (err) {
      handleError('check_unite api error', err, addNotification)
      return false
    }
  };
	
  async function set_Unite(value: string) {
    //consoleInfo('Retour_Dechet_Ligne_Show set_unite value ', value)
    set_Retour_Dechet_Ligne_Value('unite', value);
    const ret = await check_unite(value)
    //consoleInfo('Retour_Dechet_Ligne_Show set_unite ret ', ret)
    set_unite_forceOpen(false)
    if (ret === false) {
      set_unite_forceOpen(true)
    }
  }

  const handle_Unite_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Retour_Dechet_Ligne_Show handleBlur unite ', value)
    const ret = await check_unite(value)
    //consoleInfo('Retour_Dechet_Ligne_Show handle_Unite_Blur ret ', ret)
    set_unite_forceOpen(false)
    if (ret === false) {
      set_unite_forceOpen(true)
    }
  };

  const unite_initialFilter: Filter<Unite_Type> = {
    code: retour_Dechet_Ligne.unite
  };
	
	
  return (
    <GenericShowPage<Retour_Dechet_Ligne_Type>
      tableName={ RETOUR_DECHET_LIGNE_TABLE_NAME }
      columns={retour_Dechet_Ligne_Columns}
      apiUrl={`${RETOUR_DECHET_FETCH_URL}/${id}/${RETOUR_DECHET_LIGNE_CHILD_URL}`}
      entityId={childId}
      isEditMode={edit}
      childUrl="ligne"
      setRemoteMode={setMode}
      setEditedEntity={ set_Retour_Dechet_Ligne }
      getDisplayName={(retour_Dechet_Ligne: Retour_Dechet_Ligne_Type) => 'Ligne retour déchets '+retour_Dechet_Ligne.id}
      getId={(retour_Dechet_Ligne: Retour_Dechet_Ligne_Type) =>  retour_Dechet_Ligne.id }
      getEditedEntity={() => retour_Dechet_Ligne }
      getNewEntity={get_New_Retour_Dechet_Ligne }
      getDuplicateEntity={get_Duplicate_Retour_Dechet_Ligne }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>            
          <MuiPKTextField
            name="id"
            label="Id"
            value={ retour_Dechet_Ligne.id }
            fullWidth
            mode={mode}
            error={!!errors.id }
            helperText={errors.id }
            onChange={handleChange}
            onClear={() => set_Retour_Dechet_Ligne_Value("id", "")} 
          />
          <MuiTextField
            name="retour_dechet_numero"
            label="N° retour déchets"
            type="number"
            value={ retour_Dechet_Ligne.retour_dechet_numero }
            fullWidth
            error={!!errors.ligne_numero }
            helperText={errors.ligne_numero }
            mode={"Browse"}
          />
          <MuiTextField
            name="ligne_numero"
            label="N° ligne"
            type="number"
            value={ retour_Dechet_Ligne.ligne_numero }
            fullWidth
            onChange={handleChange}
            error={!!errors.ligne_numero }
            helperText={errors.ligne_numero }
            mode={mode}
            onClear={() => set_Retour_Dechet_Ligne_Value('ligne_numero', '')}
          />
          <ReferenceField 
            name="article_code"
            label="Article"
            value={ retour_Dechet_Ligne.article_code }
            fullWidth
            onChange={handleChange}
            onBlur={handle_Article_Code_Blur}
            error={!!errors.article_code }
            helperText={errors.article_code }
            mode={mode}
            onClear={() => set_Retour_Dechet_Ligne_Value('article_code', '')}  
            fieldName='code'
            setValue={function (value: any): void {
              set_Article_Code(value);
            }}
            maxRows="md"
            DataTableComponent={ Article_List_Modal }
            dataTableProps={{ permanentFilter: articlePermanentFilter, initialFilter: article_initialFilter }}
            followUrl={`${ ARTICLE_URL}/${ retour_Dechet_Ligne.article_code }`}
            forceOpen={ article_code_forceOpen }
          />
          <MuiTextField
            name="article_designation"
            label="Désignation"
            value={ retour_Dechet_Ligne.article_designation }
            fullWidth
            mode={mode}
            error={!!errors.article_designation }
            helperText={errors.article_designation }
            onChange={handleChange}
            onClear={() => set_Retour_Dechet_Ligne_Value("article_designation", "")}
          />
          <ReferenceField 
            name="unite"
            label="Unité"
            value={ retour_Dechet_Ligne.unite }
            fullWidth
            onChange={handleChange}
            onBlur={handle_Unite_Blur}
            error={!!errors.unite }
            helperText={errors.unite }
            mode={mode}
            onClear={() => set_Retour_Dechet_Ligne_Value('unite', '')}  
            fieldName='code'
            setValue={function (value: any): void {
              set_Unite(value);
            }}
            maxRows="md"
            DataTableComponent={ Unite_List_Modal }
            dataTableProps={{ initialFilter: unite_initialFilter }}
            followUrl={`${ UNITE_URL}/${ retour_Dechet_Ligne.unite }`}
            forceOpen={ unite_forceOpen }
          />
          <MuiTextField
            name="quantite"
            label="Quantité"
            type="number"
            value={ retour_Dechet_Ligne.quantite }
            fullWidth
            onChange={handleChange}
            error={!!errors.quantite }
            helperText={errors.quantite }
            mode={mode}
            onClear={() => set_Retour_Dechet_Ligne_Value('quantite', '')}
          />
          <MuiTextField
            name="prix_vente"
            label="P.U. Vente"
            type="number"
            value={ retour_Dechet_Ligne.prix_vente }
            fullWidth
            onChange={handleChange}
            error={!!errors.prix_vente }
            helperText={errors.prix_vente }
            mode={mode}
            onClear={() => set_Retour_Dechet_Ligne_Value('prix_vente', '')}
          />
          <MuiTextField
            name="montant"
            label="Montant"
            type="number"
            value={ retour_Dechet_Ligne.montant }
            fullWidth
            error={!!errors.montant }
            helperText={errors.montant }
            mode={"Browse"}
          />
        </>
      }
    />
  );
};

export default Retour_Dechet_Ligne_Show;