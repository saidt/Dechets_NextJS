"use client";

import {
  Empty_Sortie_Dechet_Detail,
  SORTIE_DECHET_DETAIL_CHILD_URL,
  SORTIE_DECHET_DETAIL_TABLE_NAME,
  sortie_Dechet_Detail_Schema,
  Sortie_Dechet_Detail_Type,
  sortie_Dechet_Detail_Columns,
} from "@/types/sortie-dechet-detail";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { CmListProps, Filter, Mode } from "@/lib/types";
import { useState } from "react";
import { MuiNumberField, MuiPKTextField, MuiTextField } from "@/components/form-show/Inputs";
import { ReferenceField } from "@/components/form-show/ReferenceField";
import { useParams, useSearchParams } from "next/navigation";
import { getResponseData } from "@/lib/html";
import { Article_Type, ARTICLE_URL } from "@/types/article";
import Article_List from "../article/Article_List";
import { SORTIE_DECHET_FETCH_URL } from "@/types/sortie-dechet";
import { fetch_Article } from "@/fetch/article";
import { useAppContext } from "@/app/context/AppContext";
import { handleError } from "@/lib/error";

// Declared at module level (not inside Sortie_Dechet_Detail_Show) so each keeps the same
// component identity across re-renders: a component declared inside another
// one is a new type on every render, which remounts it (list reloaded, state
// lost) and, on an API error, re-notifies in an endless loop.
// Per-render values (filters) are passed through ReferenceField dataTableProps.
const Article_List_Modal = (props: CmListProps<Article_Type>) => (
  <Article_List {...props} isModalList={true} />
);

const Sortie_Dechet_Detail_Show = () => {
  const { addNotification } = useAppContext();
  const { id, childId } = useParams<{ id: string; childId: string }>();

  //consoleInfo('Sortie_Dechet_Detail_Show id Param: ', id)
  //consoleInfo('Sortie_Dechet_Detail_Show childId Param: ', childId)

  // Copy: modifying Empty_Sortie_Dechet_Detail itself would change the shared object used everywhere
  const empty_Sortie_Dechet_Detail : Sortie_Dechet_Detail_Type = { ...Empty_Sortie_Dechet_Detail, sortie_dechet_numero: Number(id) };
	

  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Sortie_Dechet_Detail_Show edit: ', edit)

  const [sortie_Dechet_Detail, set_Sortie_Dechet_Detail] = useState<Sortie_Dechet_Detail_Type>(empty_Sortie_Dechet_Detail);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Sortie_Dechet_Detail_Type, string>>>({});
  const [article_code_forceOpen, set_article_code_forceOpen] = useState<boolean>(false);

  function validate(sortie_Dechet_Detail: Sortie_Dechet_Detail_Type) : boolean {    
    const result = sortie_Dechet_Detail_Schema.safeParse(sortie_Dechet_Detail);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Sortie_Dechet_Detail_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const get_New_Sortie_Dechet_Detail = () => {
    const newEntity : Sortie_Dechet_Detail_Type = { ...empty_Sortie_Dechet_Detail }
    return newEntity
  }

  const get_Duplicate_Sortie_Dechet_Detail = () => {
    const { id, ...rest } : Sortie_Dechet_Detail_Type = sortie_Dechet_Detail;
    const dupEntity : Sortie_Dechet_Detail_Type = { id:0, ...rest}
    //consoleInfo('Sortie_Dechet_Detail_Show getDuplicateSortie_Dechet_Detail dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (sortie_Dechet_Detail : Sortie_Dechet_Detail_Type, modifiedSortie_Dechet_Detail : Partial<Sortie_Dechet_Detail_Type>) : Partial<Sortie_Dechet_Detail_Type> => {
    const modifiedWithId={ id: sortie_Dechet_Detail.id, ...modifiedSortie_Dechet_Detail};
    return modifiedWithId
  }

  function set_Sortie_Dechet_Detail_Value(name: string, value: any) {
    //consoleInfo('Sortie_Dechet_Detail_Show set_Sortie_Dechet_Detail_Value name/value ', name, '/', value)
    set_Sortie_Dechet_Detail((prevSortie_Dechet_Detail) => ({
      ...prevSortie_Dechet_Detail,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_Sortie_Dechet_Detail_Value(name, value);
  };
	
	const check_article_code = async(value: string) : Promise<boolean> =>{
    try {
      const response = await fetch_Article(value)
      const data : Article_Type = await getResponseData(response, 'check_article_code api error')
      //consoleInfo('Sortie_Dechet_Detail_Show check_article_code data ', data)

      if (! data) {
        set_Sortie_Dechet_Detail_Value('article_designation', '');
        return false
      }
      else {
        set_Sortie_Dechet_Detail_Value('article_designation', data.designation);
        return true
      }
    }
    catch (err) {
      handleError('check_article_code api error', err, addNotification)
      return false
    }
  };
	
  async function set_Article_Code(value: string) {
    //consoleInfo('Sortie_Dechet_Detail_Show set_article_code value ', value)
    set_Sortie_Dechet_Detail_Value('article_code', value);
    const ret = await check_article_code(value)
    //consoleInfo('Sortie_Dechet_Detail_Show set_article_code ret ', ret)
    set_article_code_forceOpen(false)
    if (ret === false) {
      set_article_code_forceOpen(true)
    }
  }

  const handle_Article_Code_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Sortie_Dechet_Detail_Show handleBlur article_code ', value)
    const ret = await check_article_code(value)
    //consoleInfo('Sortie_Dechet_Detail_Show handle_Article_Code_Blur ret ', ret)
    set_article_code_forceOpen(false)
    if (ret === false) {
      set_article_code_forceOpen(true)
    }
  };

  const article_fk_initialFilter: Filter<Article_Type> = {
    code: sortie_Dechet_Detail.article_code
  };

  const articlePermanentFilter: Filter<Article_Type> = {
    nature: { value: 'PF', exactFilter: true },
  };


  return (
    <GenericShowPage<Sortie_Dechet_Detail_Type>
      tableName={ SORTIE_DECHET_DETAIL_TABLE_NAME }
      columns={sortie_Dechet_Detail_Columns}
      apiUrl={`${SORTIE_DECHET_FETCH_URL}/${id}/${SORTIE_DECHET_DETAIL_CHILD_URL}`}
      entityId={childId}
      isEditMode={edit}
      childUrl="detail"
      setRemoteMode={setMode}
      setEditedEntity={ set_Sortie_Dechet_Detail }
      getDisplayName={(sortie_Dechet_Detail: Sortie_Dechet_Detail_Type) => 'Sortie déchets détails '+sortie_Dechet_Detail. id}
      getId={(sortie_Dechet_Detail: Sortie_Dechet_Detail_Type) =>  sortie_Dechet_Detail.id }
      getEditedEntity={() => sortie_Dechet_Detail }
      getNewEntity={get_New_Sortie_Dechet_Detail }
      getDuplicateEntity={get_Duplicate_Sortie_Dechet_Detail }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <MuiPKTextField
            name="id"
            label="Id"
            value={ sortie_Dechet_Detail.id }
            fullWidth
            mode={mode}
            error={!!errors.id }
            helperText={errors.id }
            onChange={handleChange}
            onClear={() => set_Sortie_Dechet_Detail_Value("id", "")} 
          />
          <MuiNumberField
            name="sortie_dechet_numero"
            label="N° sortie déchets"
            value={ sortie_Dechet_Detail.sortie_dechet_numero }
            fullWidth
            error={!!errors.ligne_numero }
            helperText={errors.ligne_numero }
            mode={"Browse"}
          />
          <MuiNumberField
            name="ligne_numero"
            label="N° ligne"
            value={ sortie_Dechet_Detail.ligne_numero }
            fullWidth
            onChange={handleChange}
            error={!!errors.ligne_numero }
            helperText={errors.ligne_numero }
            mode={mode}
            onClear={() => set_Sortie_Dechet_Detail_Value('ligne_numero', '')}
          />
          <ReferenceField
            name="article_code"
            label="Article"
            value={ sortie_Dechet_Detail.article_code }
            fullWidth
            onChange={handleChange}
            onBlur={handle_Article_Code_Blur}
            error={!!errors.article_code }
            helperText={errors.article_code }
            mode={mode}
            onClear={() => set_Sortie_Dechet_Detail_Value('article_code', '')}  
            fieldName='code'
            setValue={function (value: any): void {
              set_Article_Code(value);
            }}
            maxRows="md"
            DataTableComponent={ Article_List_Modal }
            dataTableProps={{ permanentFilter: articlePermanentFilter, initialFilter: article_fk_initialFilter }}
            followUrl={`${ ARTICLE_URL}/${ sortie_Dechet_Detail.article_code }`}
            forceOpen={ article_code_forceOpen }
          />
          <MuiTextField
            name="article_designation"
            label="Désignation"
            value={ sortie_Dechet_Detail.article_designation }
            fullWidth
            mode={mode}
            error={!!errors.article_designation }
            helperText={errors.article_designation }
            onChange={handleChange}
            onClear={() => set_Sortie_Dechet_Detail_Value("article_designation", "")}
          />
          <MuiNumberField
            name="poids"
            label="Poids"
            value={ sortie_Dechet_Detail.poids }
            fullWidth
            onChange={handleChange}
            error={!!errors.poids }
            helperText={errors.poids }
            mode={mode}
            onClear={() => set_Sortie_Dechet_Detail_Value('poids', '')}
          />
          <MuiNumberField
            name="ml"
            label="M.L."
            value={ sortie_Dechet_Detail.ml }
            fullWidth
            onChange={handleChange}
            error={!!errors.ml }
            helperText={errors.ml }
            mode={mode}
            onClear={() => set_Sortie_Dechet_Detail_Value('ml', '')}
          />
          <MuiNumberField
            name="prix_vente"
            label="PU Vente"
            fractionDigits={2}
            value={ sortie_Dechet_Detail.prix_vente }
            fullWidth
            onChange={handleChange}
            error={!!errors.prix_vente }
            helperText={errors.prix_vente }
            mode={mode}
            onClear={() => set_Sortie_Dechet_Detail_Value('prix_vente', '')}
          />
          <MuiNumberField
            name="montant"
            label="Montant"
            fractionDigits={2}
            value={ sortie_Dechet_Detail.montant }
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

export default Sortie_Dechet_Detail_Show;