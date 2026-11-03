"use client";

import { getResponseData } from "@/lib/html";
import { GenericMemListPage, GenericMemListPageProps } from "@/components/datatable/GenericMemListPage";
import { Column } from "@/lib/types";
import { useSession } from "next-auth/react";
import { consoleInfo } from "@/lib/clientLog";
import { fetch_Client_Dechet_Reste_A_Payer } from "@/fetch/client-dechet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { clientError } from "@/lib/error";
import { useAppContext } from "@/app/context/AppContext";

export type Reste_A_Payer_Type = {
  ANNEE: Number;
  MOIS: Number;
  NUMERO: Number;
  DATE_PIECE: Date;
  CLIENT_CODE: String;
  CLIENT_RAISON_SOCIALE: String;
  MONTANT: Number;
  MONTANT_REGLE: Number;
  RESTE_A_REGLER: Number;
};

export interface CdrapMemListPageProps extends GenericMemListPageProps<Reste_A_Payer_Type> {
  code: string
}

const Client_Dechet_Reste_A_Payer = ({code, ...restProps}: CdrapMemListPageProps) => {

  const { data: session, status } = useSession()
  const router =  useRouter()
  const { getCurrentUrl } = useAppContext();
  const curUrl = getCurrentUrl()

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("Client_Dechet_Reste_A_Payer: session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]); 

  async function fetchAllData() {
    try {
      const response = await fetch_Client_Dechet_Reste_A_Payer(code)
      const data : Reste_A_Payer_Type[] = await getResponseData(response, 'Client_Dechet_Reste_A_Payer api error')
      consoleInfo('Client_Dechet_Reste_A_Payer fetchAllData data ', data)
      return data;
    }
    catch (err) {
      throw err;
    }
  }

  const columns: Column<Reste_A_Payer_Type>[] = [
    { 
      accessor: 'ANNEE' as keyof Reste_A_Payer_Type,
      header: 'Année' , 
      width: 100,
    },
    { 
      accessor: 'MOIS' as keyof Reste_A_Payer_Type,
      header: 'Mois' , 
      width: 100,
    },
    { 
      accessor: 'NUMERO' as keyof Reste_A_Payer_Type,
      header: 'Numéro',
      width: 100,
      meta: { isPrimaryKey: true }
    },
    { 
      accessor: 'DATE_PIECE' as keyof Reste_A_Payer_Type,
      header: 'Date',
      width: 150
    },
    { 
      accessor: 'CLIENT_CODE' as keyof Reste_A_Payer_Type,
      header: 'Client' , 
      width: 100,
    },
    { 
      accessor: 'CLIENT_RAISON_SOCIALE' as keyof Reste_A_Payer_Type,
      header: 'Raison sociale' , 
      width: 250,
    },
    { 
      accessor: 'MONTANT' as keyof Reste_A_Payer_Type,
      header: 'Montant' , 
      width: 100,
      meta: { decimals: 2 },
    },
    { 
      accessor: 'MONTANT_REGLE' as keyof Reste_A_Payer_Type,
      header: 'MT réglé' , 
      width: 100,
      meta: { decimals: 2 },
    },
    { 
      accessor: 'RESTE_A_REGLER' as keyof Reste_A_Payer_Type,
      header: 'Reste' , 
      width: 100,
      meta: { decimals: 2 },
    },
  ];

  return (
    <GenericMemListPage<Reste_A_Payer_Type> {...restProps}
      title={`Reste à payer des sortie déchets du client ${code}`}
      columns={columns}
      isModalList={false}
      fetchAllData={fetchAllData}
    />
  )
};

export default Client_Dechet_Reste_A_Payer;