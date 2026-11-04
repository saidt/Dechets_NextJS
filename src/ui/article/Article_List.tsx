"use client";

import {
  article_Columns,
  ARTICLE_LIST_TITLE,
  ARTICLE_TABLE_NAME,
  Article_Type,
} from "@/types/article";
import { GenericListPage } from "@/components/datatable/GenericListPage";
import { CmListProps, TableState } from "@/lib/types";
import TitleCard from "@/components/shared/TitleCard";
import { NextResponse } from "next/server";
import { useEffect, useState } from "react";
import useAuth from "@/app/context/UseAuth";
import { StatistiqueMenu } from "@/components/ui/menu/Menus";
import Stored_Proc_List from "../sp/Stored_Proc_List";
import PeriodeDialog from "@/components/ui/dialog/PeriodeDialog";
import { formatDateTime } from "@/lib/date-utils";
import { Stored_Proc_Param_Type } from "@/types/sp";
import { fetch_All_Article_List, fetch_Article_List } from "@/fetch/article";
import DateDialog from "@/components/ui/dialog/DateDialog";
import { consoleInfo } from "@/lib/clientLog";
import { DateResultType, fetchDateDeb, fetchPeriode, PeriodeResultType } from "@/lib/periode";
import { useAppContext } from "@/app/context/AppContext";
import { handleError } from "@/lib/error";

const Article_List = (props: CmListProps<Article_Type>) => {

  const [dateDeb, setDateDeb] = useState<Date | null>(new Date());
  const [dateFin, setDateFin] = useState<Date | null>(new Date());
  const [spName, setSpName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [params, setParams] = useState<Stored_Proc_Param_Type[]>([]);
  
  const [periodeOpen, setPeriodeOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  const [dateOpen, setDateOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date());
  const [typeMetal, setTypeMetal] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { addNotification } = useAppContext();

  async function fetchRows(
    tableState: TableState<Article_Type>
  ): Promise<NextResponse> {
    return await fetch_Article_List(tableState);
  }

  async function fetchAllRows(
    tableState: TableState<Article_Type>
  ): Promise<NextResponse> {
    return await fetch_All_Article_List(tableState);
  }
  
  const handle_Stats_Resume = async() => {
    setSpName("dbo.STAT_SORTIE_DECHET_TOUS_RESUME")
    setPeriodeOpen(true)
  }

  const handle_Stats_Detail = async() => {
    setSpName("dbo.STAT_SORTIE_DECHET_TOUS_DETAIL")
    setPeriodeOpen(true)
  }

  const handle_Solde_Cuivre = async() => {
    setSpName("dbo.ARTICLE_BAROUDI_SOLDE_DECHET")
    setTypeMetal("Cu")
    setDateOpen(true)
  }

  const handle_Solde_Aluminium = async() => {
    setSpName("dbo.ARTICLE_BAROUDI_SOLDE_DECHET")
    setTypeMetal("Alu")
    setDateOpen(true)
  }

  const handle_Execute_Periode = async() => {
    if (spName === "dbo.STAT_SORTIE_DECHET_TOUS_RESUME") {
      setTitle(
        `Statistiques des sorties déchets de tous les articles (résumé)
        du ${dateDeb ? formatDateTime(dateDeb) : ''}
        au ${dateFin ? formatDateTime(dateFin) : ''}`
      );
      setParams([
        {name: "DateDeb", value: dateDeb},
        {name: "DateFin", value: dateFin}
      ])
    }
    else if (spName === "dbo.STAT_SORTIE_DECHET_TOUS_DETAIL") {
      setTitle(
        `Statistiques des sorties déchets de tous les articles (détail)
        du ${dateDeb ? formatDateTime(dateDeb) : ''}
        au ${dateFin ? formatDateTime(dateFin) : ''}`
      );
      setParams([
        {name: "DateDeb", value: dateDeb},
        {name: "DateFin", value: dateFin}
      ])
    }
    setStatsOpen(true)
  }

  const handle_Execute_Date = async() => {
    if (spName === "dbo.ARTICLE_BAROUDI_SOLDE_DECHET") {
      setTitle(
        `Solde ${typeMetal} au ${date ? formatDateTime(date) : ''}`
      );
      consoleInfo(`DateFin ${date} `)
      setParams([
        {name: "DateFin", value: date},
        {name: "TypeMetal", value: typeMetal}
      ])
    }
    setStatsOpen(true)
  }

  const handleClosePeriode = () => {
    setPeriodeOpen(false);
  };

  const handleCloseDate = () => {
    setDateOpen(false);
  };

  const handleCloseStats = () => {
    setStatsOpen(false);
  };

  const { hasRole } = useAuth();

  const optionsMenu : React.ReactNode[] = [
    (hasRole("dbo.STAT_SORTIE_DECHET_TOUS_RESUME.EXEC") && 
      <StatistiqueMenu caption="Statistiques des sorties déchets tous (résumé)" onClick={handle_Stats_Resume} />),
    (hasRole("dbo.STAT_SORTIE_DECHET_TOUS_DETAIL.EXEC") && 
      <StatistiqueMenu caption="Statistiques des sorties déchets tous (détail)" onClick={handle_Stats_Detail} />),
    (hasRole("dbo.ARTICLE_BAROUDI_SOLDE_DECHET.EXEC") && 
      <StatistiqueMenu caption="Solde cuivre à date" onClick={handle_Solde_Cuivre} />),
    (hasRole("dbo.ARTICLE_BAROUDI_SOLDE_DECHET.EXEC") && 
      <StatistiqueMenu caption="Solde aluminium à date" onClick={handle_Solde_Aluminium} />)
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
        handleError("Article_List fetch_Periode failed", err, addNotification);
      }
      finally {
        setLoading(false);
      }
    }
    fetch_Periode();
  }, []);


  useEffect(() => {
    async function fetch_Date_Deb() {
      setLoading(true);
      try {
        const dateDebResult : DateResultType = await fetchDateDeb();
        if (dateDebResult.error) {
          addNotification(dateDebResult.error, "error");
        }
        else {
          setDate(dateDebResult.date);
        }
      }
      catch (err) {
        handleError("Article_List fetch_Date_Deb failed", err, addNotification);
      }
      finally {
        setLoading(false);
      }
    }
    fetch_Date_Deb();
  }, []);



  return (
    <TitleCard title={ ARTICLE_LIST_TITLE }>
      <GenericListPage<Article_Type> {...props}
        tableName={ ARTICLE_TABLE_NAME }
        title={ ARTICLE_LIST_TITLE }
        columns={article_Columns}
        fetchData={fetchRows}
        fetchAllData={fetchAllRows}
        getId={(article: Article_Type) => article.code }
        optionsMenu={optionsMenu}
        loading={loading}
      />
      <PeriodeDialog
        open={periodeOpen}
        onClose={handleClosePeriode}
        dateDeb={dateDeb}
        dateFin={dateFin}
        setDateDeb={setDateDeb}
        setDateFin={setDateFin}
        onExecuteClick={handle_Execute_Periode}
      />
      <DateDialog
        open={dateOpen}
        onClose={handleCloseDate}
        date={date}
        setDate={setDate}
        onExecuteClick={handle_Execute_Date}
      />
      <Stored_Proc_List
        spName={spName}
        open={statsOpen}
        onClose={handleCloseStats}
        title={title}
        params={params}
      />
    </TitleCard>
  )
};

export default Article_List;