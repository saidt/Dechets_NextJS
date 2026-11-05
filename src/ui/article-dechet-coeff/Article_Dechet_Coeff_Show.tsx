"use client";

import {
  Empty_Article_Dechet_Coeff,
  ARTICLE_DECHET_COEFF_FETCH_URL,
  ARTICLE_DECHET_COEFF_TABLE_NAME,
  article_Dechet_Coeff_Schema,
  Article_Dechet_Coeff_Type,
  article_Dechet_Coeff_Columns
} from "@/types/article-dechet-coeff";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { CmListProps, Filter, Mode } from "@/lib/types";
import { useEffect, useState } from "react";
import { MuiNumberField, MuiTextField } from "@/components/form-show/Inputs";
import { ReferenceField } from "@/components/form-show/ReferenceField";
import { useParams, useSearchParams } from "next/navigation";

import { Article_Type, ARTICLE_URL, Empty_Article } from "@/types/article";
import Article_List from "../article/Article_List";
import { getResponseData } from "@/lib/html";
import { fetch_Article } from "@/fetch/article";
import { useAppContext } from "@/app/context/AppContext";
import { handleError } from "@/lib/error";

// Declared at module level (not inside Article_Dechet_Coeff_Show) so each keeps the same
// component identity across re-renders: a component declared inside another
// one is a new type on every render, which remounts it (list reloaded, state
// lost) and, on an API error, re-notifies in an endless loop.
// Per-render values (filters) are passed through ReferenceField dataTableProps.
const Article_List_Modal = (props: CmListProps<Article_Type>) => (
  <Article_List {...props} isModalList={true} />
);

const Article_Dechet_Coeff_Show = () => {
  const { addNotification } = useAppContext();

  const { id } = useParams<{ id: string }>();
  //consoleInfo('Article_Dechet_Coeff_Show idParam: ', id)

  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Article_Dechet_Coeff_Show edit: ', edit)

  const [article_Dechet_Coeff, setArticle_Dechet_Coeff] = useState<Article_Dechet_Coeff_Type>(Empty_Article_Dechet_Coeff);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Article_Dechet_Coeff_Type, string>>>({});
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<Article_Type>(Empty_Article);

  function validate(article_Dechet_Coeff: Article_Dechet_Coeff_Type) : boolean {    
    const result = article_Dechet_Coeff_Schema.safeParse(article_Dechet_Coeff);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Article_Dechet_Coeff_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const getNewArticle_Dechet_Coeff = () => {
    const newEntity : Article_Dechet_Coeff_Type = Empty_Article_Dechet_Coeff
    return newEntity
  }

  const getDuplicateArticle_Dechet_Coeff = () => {
    const { article_code, ...rest } : Article_Dechet_Coeff_Type = article_Dechet_Coeff;
    const dupEntity : Article_Dechet_Coeff_Type = { article_code:'', ...rest}
    //consoleInfo('Article_Dechet_Coeff_Show getDuplicateArticle_Dechet_Coeff dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (article_Dechet_Coeff : Article_Dechet_Coeff_Type, modifiedArticle_Dechet_Coeff : Partial<Article_Dechet_Coeff_Type>) : Partial<Article_Dechet_Coeff_Type> => {
    const modifiedWithId={ article_code: article_Dechet_Coeff.article_code, ...modifiedArticle_Dechet_Coeff};
    return modifiedWithId
  }

  function setArticle_Dechet_CoeffValue(name: string, value: any) {
    //consoleInfo('Article_Dechet_Coeff_Show setArticle_Dechet_CoeffValue name/value ', name, '/', value)
    setArticle_Dechet_Coeff((prevArticle_Dechet_Coeff) => ({
      ...prevArticle_Dechet_Coeff,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setArticle_Dechet_CoeffValue(name, value);
  };

  const articlePermanentFilter: Filter<Article_Type> = {
    nature: { value: 'DECHET', exactFilter: true },
  };


  useEffect(() => {
      const load_Article = async () => {
        try {
          setLoading(true)
          const response = await fetch_Article(article_Dechet_Coeff.article_code)
          const data : Article_Type = await getResponseData(response, 'Article_Dechet_Coeff_Show load_Article api error')
          //consoleInfo('Article_Dechet_Coeff_Show load_Article data ', data)
          if (data === null) {
            setArticle(Empty_Article);
          }
          else {
            setArticle(data);
          }
        }
        catch (err) {
          handleError('load_Article api error', err, addNotification)
        }
        finally {
          setLoading(false)
        }
      };
  
      load_Article();
    }, [article_Dechet_Coeff]);

  return (
    <GenericShowPage<Article_Dechet_Coeff_Type>
      tableName={ ARTICLE_DECHET_COEFF_TABLE_NAME }
      columns={article_Dechet_Coeff_Columns}
			apiUrl={ ARTICLE_DECHET_COEFF_FETCH_URL}
      entityId={id}
      isEditMode={edit}
      setRemoteMode={setMode}
      loading={loading}
      setEditedEntity={ setArticle_Dechet_Coeff }
      getDisplayName={(article_Dechet_Coeff: Article_Dechet_Coeff_Type) => 'Coéfficent article déchet '+article_Dechet_Coeff. article_code}
      getId={(article_Dechet_Coeff: Article_Dechet_Coeff_Type) =>  article_Dechet_Coeff.article_code }
      getEditedEntity={() => article_Dechet_Coeff }
      getNewEntity={getNewArticle_Dechet_Coeff }
      getDuplicateEntity={getDuplicateArticle_Dechet_Coeff }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <ReferenceField 
            name="article_code"
            label="Article"
            value={article_Dechet_Coeff.article_code}
            fullWidth
            onChange={handleChange}
            error={!!errors.article_code}
            helperText={errors.article_code}
            mode={mode}
            onClear={() => setArticle_Dechet_CoeffValue('article_code', '')}
            fieldName='code'
            setValue={function (value: any): void {
              setArticle_Dechet_CoeffValue('article_code', value);
            } }
            maxRows="md"
            DataTableComponent={ Article_List_Modal }
            dataTableProps={{ permanentFilter: articlePermanentFilter }}
            followUrl={`${ARTICLE_URL}/${article_Dechet_Coeff.article_code}`} 
            isPK={true}
          />
          <MuiTextField
            name="article_designation"
            label="Désignation"
            value={ article.designation }
            fullWidth
            mode={"Browse"}
          />
          <MuiNumberField
            name="coeff"
            label="Coéfficient"
            fractionDigits={2}
            value={ article_Dechet_Coeff.coeff }
            fullWidth
            onChange={handleChange}
            error={!!errors.coeff }
            helperText={errors.coeff }
            mode={mode}
            onClear={() => setArticle_Dechet_CoeffValue('coeff', '')}
          />
        </>
      }
    />
  );
};

export default Article_Dechet_Coeff_Show;