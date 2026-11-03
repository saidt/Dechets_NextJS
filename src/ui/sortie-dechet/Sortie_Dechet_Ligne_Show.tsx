"use client";

import {
  Empty_Sortie_Dechet_Ligne,
  SORTIE_DECHET_LIGNE_CHILD_URL,
  SORTIE_DECHET_LIGNE_TABLE_NAME,
  sortie_Dechet_Ligne_Schema,
  Sortie_Dechet_Ligne_Type,
  sortie_Dechet_Ligne_Columns,
} from "@/types/sortie-dechet-ligne";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { CmListProps, Filter, Mode } from "@/lib/types";
import { useState } from "react";
import { MuiNumberField, MuiPKNumberField, MuiPKTextField, MuiTextField } from "@/components/form-show/Inputs";
import { ReferenceField } from "@/components/form-show/ReferenceField";
import { useParams, useSearchParams } from "next/navigation";
import { getResponseData } from "@/lib/html";
import { Article_Type, ARTICLE_URL } from "@/types/article";
import Article_List from "../article/Article_List";
import { Unite_Type, UNITE_URL } from "@/types/unite";
import Unite_List from "../unite/Unite_List";
import { SORTIE_DECHET_FETCH_URL } from "@/types/sortie-dechet";
import { fetch_Article } from "@/fetch/article";
import { fetch_Unite } from "@/fetch/unite";
import { Pesee_Type, PESEE_URL } from "@/types/pesee";
import Pesee_List from "../pesee/Pesee_List";
import { fetch_Pesee } from "@/fetch/pesee";
//import { consoleInfo } from "@/lib/log";

const Sortie_Dechet_Ligne_Show = () => {
  //const { addNotification } = useAppContext();
  const { id, childId } = useParams<{ id: string; childId: string }>();

  //consoleInfo('Sortie_Dechet_Ligne_Show id Param: ', id)
  //consoleInfo('Sortie_Dechet_Ligne_Show childId Param: ', childId)

  const empty_Sortie_Dechet_Ligne = Empty_Sortie_Dechet_Ligne;
  empty_Sortie_Dechet_Ligne.sortie_dechet_numero = Number(id)
	
  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Sortie_Dechet_Ligne_Show edit: ', edit)

  const [sortie_Dechet_Ligne, set_Sortie_Dechet_Ligne] = useState<Sortie_Dechet_Ligne_Type>(empty_Sortie_Dechet_Ligne);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Sortie_Dechet_Ligne_Type, string>>>({});
  const [article_code_forceOpen, set_article_code_forceOpen] = useState<boolean>(false);
  const [unite_forceOpen, set_unite_forceOpen] = useState<boolean>(false);
  const [pesee_numero_forceOpen, set_pesee_numero_forceOpen] = useState<boolean>(false);

  function validate(sortie_Dechet_Ligne: Sortie_Dechet_Ligne_Type) : boolean {    
    const result = sortie_Dechet_Ligne_Schema.safeParse(sortie_Dechet_Ligne);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Sortie_Dechet_Ligne_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const get_New_Sortie_Dechet_Ligne = () => {
    const newEntity : Sortie_Dechet_Ligne_Type = Empty_Sortie_Dechet_Ligne
    return newEntity
  }

  const get_Duplicate_Sortie_Dechet_Ligne = () => {
    const { id, ...rest } : Sortie_Dechet_Ligne_Type = sortie_Dechet_Ligne;
    const dupEntity : Sortie_Dechet_Ligne_Type = { id:0, ...rest}
    //consoleInfo('Sortie_Dechet_Ligne_Show getDuplicateSortie_Dechet_Ligne dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (sortie_Dechet_Ligne : Sortie_Dechet_Ligne_Type, modifiedSortie_Dechet_Ligne : Partial<Sortie_Dechet_Ligne_Type>) : Partial<Sortie_Dechet_Ligne_Type> => {
    const modifiedWithId={ id: sortie_Dechet_Ligne.id, ...modifiedSortie_Dechet_Ligne};
    return modifiedWithId
  }

  function set_Sortie_Dechet_Ligne_Value(name: string, value: any) {
    //consoleInfo('Sortie_Dechet_Ligne_Show set_Sortie_Dechet_Ligne_Value name/value ', name, '/', value)
    set_Sortie_Dechet_Ligne((prevSortie_Dechet_Ligne) => ({
      ...prevSortie_Dechet_Ligne,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_Sortie_Dechet_Ligne_Value(name, value);
  };
	
	const check_article_code = async(value: string) : Promise<boolean> =>{
    try {
      const response = await fetch_Article(value)
      const data : Article_Type = await getResponseData(response, 'check_article_code api error')
      //consoleInfo('Sortie_Dechet_Ligne_Show check_article_code data ', data)

      if (! data) {
        set_Sortie_Dechet_Ligne_Value('article_designation', '');
        set_Sortie_Dechet_Ligne_Value('unite', '');
        return false
      }
      else {
        set_Sortie_Dechet_Ligne_Value('article_designation', data.designation);
        set_Sortie_Dechet_Ligne_Value('unite', data.unite_stk);
        return true
      }
    }
    catch (err) {
      throw err;
    }
  };
	
  async function set_Article_Code(value: string) {
    //consoleInfo('Sortie_Dechet_Ligne_Show set_article_code value ', value)
    set_Sortie_Dechet_Ligne_Value('article_code', value);
    const ret = await check_article_code(value)
    //consoleInfo('Sortie_Dechet_Ligne_Show set_article_code ret ', ret)
    set_article_code_forceOpen(false)
    if (ret === false) {
      set_article_code_forceOpen(true)
    }
  }

  const handle_Article_Code_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Sortie_Dechet_Ligne_Show handleBlur article_code ', value)
    const ret = await check_article_code(value)
    //consoleInfo('Sortie_Dechet_Ligne_Show handle_Article_Code_Blur ret ', ret)
    set_article_code_forceOpen(false)
    if (ret === false) {
      set_article_code_forceOpen(true)
    }
  };

  const article_initialFilter: Filter<Article_Type> = {
    code: sortie_Dechet_Ligne.article_code
  };

  const articlePermanentFilter: Filter<Article_Type> = {
    nature: 'DECHET',
  };

	const Article_List_Modal = (props: CmListProps<Article_Type>) => (
    <Article_List {...props} isModalList={true} permanentFilter={articlePermanentFilter}initialFilter={ article_initialFilter}/>
  )
  
	const check_unite = async(value: string) : Promise<boolean> =>{
    try {
      const response = await fetch_Unite(value)
      const data : Unite_Type = await getResponseData(response, 'check_unite api error')
      //consoleInfo('Sortie_Dechet_Ligne_Show check_unite data ', data)

      if (! data) {
        return false
      }
      else {
        return true
      }
    }
    catch (err) {
      throw err;
    }
  };
	
  async function set_Unite(value: string) {
    //consoleInfo('Sortie_Dechet_Ligne_Show set_unite value ', value)
    set_Sortie_Dechet_Ligne_Value('unite', value);
    const ret = await check_unite(value)
    //consoleInfo('Sortie_Dechet_Ligne_Show set_unite ret ', ret)
    set_unite_forceOpen(false)
    if (ret === false) {
      set_unite_forceOpen(true)
    }
  }

  const handle_Unite_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Sortie_Dechet_Ligne_Show handleBlur unite ', value)
    const ret = await check_unite(value)
    //consoleInfo('Sortie_Dechet_Ligne_Show handle_Unite_Blur ret ', ret)
    set_unite_forceOpen(false)
    if (ret === false) {
      set_unite_forceOpen(true)
    }
  };

  const unite_initialFilter: Filter<Unite_Type> = {
    code: sortie_Dechet_Ligne.unite
  };
	
	const Unite_List_Modal = (props: CmListProps<Unite_Type>) => (
    <Unite_List {...props} isModalList={true} initialFilter={unite_initialFilter}/>
  )

  const check_pesee_numero = async(value: string) : Promise<boolean> =>{
    try {
      const response = await fetch_Pesee(value)
      const data : Pesee_Type = await getResponseData(response, 'check_pesee_numero api error')
      //isDevMode() && console.log('Sortie_Dechet_Ligne_Show check_pesee_numero data ', data)

      if (! data) {
        return false
      }
      else {
        return true
      }
    }
    catch (err) {
      throw err;
    }
  };
	
  async function set_Pesee_Numero(value: string) {
    //isDevMode() && console.log('Sortie_Dechet_Ligne_Show set_pesee_numero value ', value)
    set_Sortie_Dechet_Ligne_Value('pesee_numero', value);
    const ret = await check_pesee_numero(value)
    //isDevMode() && console.log('Sortie_Dechet_Ligne_Show set_pesee_numero ret ', ret)
    set_pesee_numero_forceOpen(false)
    if (ret === false) {
      set_pesee_numero_forceOpen(true)
    }
  }

  const handle_Pesee_Numero_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //isDevMode() && console.log('Sortie_Dechet_Ligne_Show handleBlur pesee_numero ', value)
    const ret = await check_pesee_numero(value)
    //isDevMode() && console.log('Sortie_Dechet_Ligne_Show handle_Pesee_Numero_Blur ret ', ret)
    set_pesee_numero_forceOpen(false)
    if (ret === false) {
      set_pesee_numero_forceOpen(true)
    }
  };

  const pesee_fk_initialFilter: Filter<Pesee_Type> = {
    numero_1: sortie_Dechet_Ligne.pesee_numero ?? undefined
  };
	
	const Pesee_List_Modal = (props: CmListProps<Pesee_Type>) => (
    <Pesee_List {...props} isModalList={true} initialFilter={ pesee_fk_initialFilter}/>
  )
	
  return (
    <GenericShowPage<Sortie_Dechet_Ligne_Type>
      tableName={ SORTIE_DECHET_LIGNE_TABLE_NAME }
      columns={sortie_Dechet_Ligne_Columns}
      apiUrl={`${SORTIE_DECHET_FETCH_URL}/${id}/${SORTIE_DECHET_LIGNE_CHILD_URL}`}
      entityId={childId}
      isEditMode={edit}
      childUrl={SORTIE_DECHET_LIGNE_CHILD_URL}
      setRemoteMode={setMode}
      setEditedEntity={ set_Sortie_Dechet_Ligne }
      getDisplayName={(sortie_Dechet_Ligne: Sortie_Dechet_Ligne_Type) => 'Ligne sortie déchets '+sortie_Dechet_Ligne.id}
      getId={(sortie_Dechet_Ligne: Sortie_Dechet_Ligne_Type) =>  sortie_Dechet_Ligne.id }
      getEditedEntity={() => sortie_Dechet_Ligne }
      getNewEntity={get_New_Sortie_Dechet_Ligne }
      getDuplicateEntity={get_Duplicate_Sortie_Dechet_Ligne }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <MuiPKNumberField
            name="id"
            label="Id"
            value={ sortie_Dechet_Ligne.id }
            fullWidth
            mode={mode}
            error={!!errors.id }
            helperText={errors.id }
            onChange={handleChange}
            onClear={() => set_Sortie_Dechet_Ligne_Value("id", "")} 
          />
          <MuiNumberField
            name="sortie_dechet_numero"
            label="N° sortie déchets"
            value={ sortie_Dechet_Ligne.sortie_dechet_numero }
            fullWidth
            error={!!errors.ligne_numero }
            helperText={errors.ligne_numero }
            mode={"Browse"}
          />
          <MuiNumberField
            name="ligne_numero"
            label="N° ligne"
            value={ sortie_Dechet_Ligne.ligne_numero }
            fullWidth
            onChange={handleChange}
            error={!!errors.ligne_numero }
            helperText={errors.ligne_numero }
            mode={mode}
            onClear={() => set_Sortie_Dechet_Ligne_Value('ligne_numero', '')}
          />
          <ReferenceField 
            name="article_code"
            label="Article"
            value={ sortie_Dechet_Ligne.article_code }
            fullWidth
            onChange={handleChange}
            onBlur={handle_Article_Code_Blur}
            error={!!errors.article_code }
            helperText={errors.article_code }
            mode={mode}
            onClear={() => set_Sortie_Dechet_Ligne_Value('article_code', '')}  
            fieldName='code'
            setValue={function (value: any): void {
              set_Article_Code(value);
            }}
            maxRows="md"
            DataTableComponent={ Article_List_Modal }
            followUrl={`${ ARTICLE_URL}/${ sortie_Dechet_Ligne.article_code }`}
            forceOpen={ article_code_forceOpen }
          />
          <MuiTextField
            name="article_designation"
            label="Désignation"
            value={ sortie_Dechet_Ligne.article_designation }
            fullWidth
            mode={mode}
            error={!!errors.article_designation }
            helperText={errors.article_designation }
            onChange={handleChange}
            onClear={() => set_Sortie_Dechet_Ligne_Value("article_designation", "")}
          />
          <ReferenceField 
            name="unite"
            label="Unité"
            value={ sortie_Dechet_Ligne.unite }
            fullWidth
            onChange={handleChange}
            onBlur={handle_Unite_Blur}
            error={!!errors.unite }
            helperText={errors.unite }
            mode={mode}
            onClear={() => set_Sortie_Dechet_Ligne_Value('unite', '')}  
            fieldName='code'
            setValue={function (value: any): void {
              set_Unite(value);
            }}
            maxRows="md"
            DataTableComponent={ Unite_List_Modal }
            followUrl={`${ UNITE_URL}/${ sortie_Dechet_Ligne.unite }`}
            forceOpen={ unite_forceOpen }
          />
          <MuiNumberField
            name="quantite"
            label="Quantité"
            value={ sortie_Dechet_Ligne.quantite }
            fullWidth
            onChange={handleChange}
            error={!!errors.quantite }
            helperText={errors.quantite }
            mode={mode}
            onClear={() => set_Sortie_Dechet_Ligne_Value('quantite', '')}
          />
          <MuiNumberField
            name="prix_vente"
            label="P.U. Vente"
            fractionDigits={2}
            value={ sortie_Dechet_Ligne.prix_vente }
            fullWidth
            onChange={handleChange}
            error={!!errors.prix_vente }
            helperText={errors.prix_vente }
            mode={mode}
            onClear={() => set_Sortie_Dechet_Ligne_Value('prix_vente', '')}
          />
          <MuiNumberField
            name="montant"
            label="Montant"
            fractionDigits={2}
            value={ sortie_Dechet_Ligne.montant }
            fullWidth
            error={!!errors.montant }
            helperText={errors.montant }
            mode={"Browse"}
          />
          <ReferenceField 
            name="pesee_numero"
            label="N° pesée"
            value={ sortie_Dechet_Ligne.pesee_numero }
            fullWidth
            onChange={handleChange}
            onBlur={handle_Pesee_Numero_Blur}
            error={!!errors.pesee_numero }
            helperText={errors.pesee_numero }
            mode={mode}
            onClear={() => set_Sortie_Dechet_Ligne_Value('pesee_numero', '')}  
            fieldName='numero_1'
            setValue={function (value: any): void {
              set_Pesee_Numero(value);
            }}
            maxRows="md"
            DataTableComponent={ Pesee_List_Modal }
            followUrl={`${ PESEE_URL}/${ sortie_Dechet_Ligne.pesee_numero }`}
            forceOpen={ pesee_numero_forceOpen }
          />
        </>
      }
    />
  );
};

export default Sortie_Dechet_Ligne_Show;