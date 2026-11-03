"use client";

import { getResponseData } from "@/lib/html";
import { GenericMemListPage, GenericMemListPageProps } from "@/components/datatable/GenericMemListPage";
import { Column } from "@/lib/types";
import { useSession } from "next-auth/react";
import { consoleInfo } from "@/lib/clientLog";
import { fetch_Reglement_Dechet_Reste_A_Verser } from "@/fetch/reglement-dechet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { clientError } from "@/lib/error";
import { useAppContext } from "@/app/context/AppContext";

export type Reste_A_Verser_Type = {
  ANNEE: Number;
  MOIS: Number;
  NUMERO: Number;
  DATE_PIECE: Date;
  CLIENT_CODE: String;
  CLIENT_RAISON_SOCIALE: String;
  MONTANT: Number;
  MONTANT_VERSE: Number;
  RESTE_A_VERSER: Number;
};

export interface RdravMemListPageProps extends GenericMemListPageProps<Reste_A_Verser_Type> {
}

const Reglement_Dechet_Reste_A_Verser = (props: RdravMemListPageProps) => {

  const { data: session, status } = useSession()
  const router =  useRouter()
  const { getCurrentUrl } = useAppContext();
  const curUrl = getCurrentUrl()

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("GenericShowPage: session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]); 

  async function fetchAllData() {
    try {
      const response = await fetch_Reglement_Dechet_Reste_A_Verser()
      const data : Reste_A_Verser_Type[] = await getResponseData(response, 'Reglement_Dechet_Reste_A_Verser api error')
      consoleInfo('Reglement_Dechet_Reste_A_Verser fetchAllData data ', data)
      return data;
    }
    catch (err) {
      throw err;
    }
  }

  const columns: Column<Reste_A_Verser_Type>[] = [
    { 
      accessor: 'ANNEE' as keyof Reste_A_Verser_Type,
      header: 'Année' , 
      width: 100,
    },
    { 
      accessor: 'MOIS' as keyof Reste_A_Verser_Type,
      header: 'Mois' , 
      width: 100,
    },
    { 
      accessor: 'NUMERO' as keyof Reste_A_Verser_Type,
      header: 'Numéro',
      width: 100,
      meta: { isPrimaryKey: true }
    },
    { 
      accessor: 'DATE_PIECE' as keyof Reste_A_Verser_Type,
      header: 'Date',
      width: 150
    },
    { 
      accessor: 'CLIENT_CODE' as keyof Reste_A_Verser_Type,
      header: 'Client' , 
      width: 100,
    },
    { 
      accessor: 'CLIENT_RAISON_SOCIALE' as keyof Reste_A_Verser_Type,
      header: 'Raison sociale' , 
      width: 250,
    },
    { 
      accessor: 'MONTANT' as keyof Reste_A_Verser_Type,
      header: 'Montant' , 
      width: 100,
      meta: { decimals: 2 },
    },
    { 
      accessor: 'MONTANT_VERSE' as keyof Reste_A_Verser_Type,
      header: 'MT versé' , 
      width: 100,
      meta: { decimals: 2 },
    },
    { 
      accessor: 'RESTE_A_VERSER' as keyof Reste_A_Verser_Type,
      header: 'Reste' , 
      width: 100,
      meta: { decimals: 2 },
    },
  ];

  return (
    <GenericMemListPage<Reste_A_Verser_Type> {...props}
      title={`Reste à verser des réglements déchets`}
      columns={columns}
      isModalList={false}
      fetchAllData={fetchAllData}
    />
  )
};

export default Reglement_Dechet_Reste_A_Verser;