"use client";

import { Empty_Article, ARTICLE_FETCH_URL, ARTICLE_TABLE_NAME, article_Schema, Article_Type, article_Columns } from "@/types/article";
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
import { fetchPeriode, PeriodeResultType } from "@/lib/periode";
import { handleError } from "@/lib/error";
import { useAppContext } from "@/app/context/AppContext";

const Article_Show = () => {
  const [article, setArticle] = useState<Article_Type>(Empty_Article);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Article_Type, string>>>({});

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
  //consoleInfo('ArticleShowPage idParam: ', id)

  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('ArticleShowPage edit: ', edit)

  function validate(article: Article_Type) : boolean {    
    const result = article_Schema.safeParse(article);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const getNewArticle = () => {
    const newEntity : Article_Type = Empty_Article
    return newEntity
  }

  const getDuplicateArticle = () => {
    const { code, ...rest } : Article_Type = article;
    const dupEntity : Article_Type = { code:'', ...rest}
    //consoleInfo('getDuplicateArticle dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (article : Article_Type, modifiedArticle : Partial<Article_Type>) : Partial<Article_Type> => {
    const modifiedWithId={ code: article.code, ...modifiedArticle};
    return modifiedWithId
  }

  function setArticleValue(name: string, value: any) {
    //consoleInfo('setArticleValue name/value ', name, '/', value)
    setArticle((prevArticle) => ({
      ...prevArticle,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setArticleValue(name, value);
  };

  const handle_Stat_Un_Detail = () => {
    setSpName("dbo.STAT_SORTIE_DECHET_ARTICLE_UN_DETAIL")
    setPeriodeOpen(true)
  };

  const handle_Execute_Periode = () => {
    if (spName === "dbo.STAT_SORTIE_DECHET_ARTICLE_UN_DETAIL") {
      setTitle(
        `Statistiques des sorties déchets de l'article ${article.code}
        du ${dateDeb ? formatDateTime(dateDeb) : ''}
        au ${dateFin ? formatDateTime(dateFin) : ''}`
      );
      setParams([
        {name: "ArticleCode", value: article.code},
        {name: "DateDeb", value: dateDeb},
        {name: "DateFin", value: dateFin}
      ])
    }
    setStatsOpen(true)
  };

  const handleClosePeriode = () => {
    setPeriodeOpen(false);
  };

  const handleCloseStats = () => {
    setStatsOpen(false);
  };

  const { hasRole } = useAuth();

  const optionsMenu : React.ReactNode[] = [
    (hasRole("dbo.STAT_SORTIE_DECHET_ARTICLE_UN_DETAIL.EXEC") && 
      <StatistiqueMenu caption="Statistiques des sorties déchets d'un article (détail)" onClick={handle_Stat_Un_Detail} />)
  ]

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
        handleError("Article_Show fetch_Periode failed", err, addNotification);
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
      onClose={handleClosePeriode}
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
      onClose={handleCloseStats}
      title={title}
      params={params}
    />
  )

  return (
    <>
      <GenericShowPage<Article_Type>
        tableName={ ARTICLE_TABLE_NAME }
        columns={article_Columns}
        apiUrl={ ARTICLE_FETCH_URL}
        entityId={id}
        isEditMode={edit}
        optionsMenu={optionsMenu}
        loading={loading}
        setRemoteMode={setMode}
        setEditedEntity={ setArticle }
        getDisplayName={(article: Article_Type) => 'Article '+article. code}
        getId={(article: Article_Type) =>  article.code }
        getEditedEntity={() => article }
        getNewEntity={getNewArticle }
        getDuplicateEntity={getDuplicateArticle }
        getModifiedWithId={getModifiedWithId}
        validate={validate}
        children={
          <>
            <MuiPKTextField
              name="code"
              label="Code"
              value={ article.code }
              fullWidth
              mode={mode}
              error={!!errors.code }
              helperText={errors.code }
              onChange={handleChange}
              onClear={() => setArticleValue("code", "")} 
            />
            <MuiTextField
              name="designation"
              label="Désignation"
              value={ article.designation }
              fullWidth
              mode={mode}
              error={!!errors.designation }
              helperText={errors.designation }
              onChange={handleChange}
              onClear={() => setArticleValue("designation", "")}
            />
            <MuiTextField
              name="unite_stk"
              label="Unité stock"
              value={ article.unite_stk }
              fullWidth
              mode={mode}
              error={!!errors.unite_stk }
              helperText={errors.unite_stk }
              onChange={handleChange}
              onClear={() => setArticleValue("unite_stk", "")}
            />
            <MuiTextField
              name="nature"
              label="Nature"
              value={ article.nature }
              fullWidth
              mode={mode}
              error={!!errors.nature }
              helperText={errors.nature }
              onChange={handleChange}
              onClear={() => setArticleValue("nature", "")}
            />
          </>
        }
      />
      <Periode_Page />
      <Stats_Page />
    </>
  );
};

export default Article_Show;