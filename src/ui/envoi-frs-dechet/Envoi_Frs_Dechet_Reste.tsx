"use client";

import { getResponseData } from "@/lib/html";
import { GenericMemListPage, GenericMemListPageProps } from "@/components/datatable/GenericMemListPage";
import { Column } from "@/lib/types";
import { useSession } from "next-auth/react";
import { consoleInfo } from "@/lib/clientLog";
import { fetch_Envoi_Frs_Dechet_Reste } from "@/fetch/envoi-frs-dechet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { clientError } from "@/lib/error";
import { useAppContext } from "@/app/context/AppContext";

export type Envoi_Frs_Dechet_Reste_Type = {
  ANNEE: number;
  NO_DOS_EXP: number;
  NO_CMD_EXP: number;
  DATE_CMD: Date;
  ARTICLE_CODE: string;
  QUANTITE: number;
}

export interface EfdrMemListPageProps
  extends Omit<
    GenericMemListPageProps<Envoi_Frs_Dechet_Reste_Type>,
    "title" | "columns" 
  > {
}

const Envoi_Frs_Dechet_Reste = (props: EfdrMemListPageProps) => {

  const { data: session, status } = useSession()
  const router =  useRouter()
  const { getCurrentUrl } = useAppContext();
  const curUrl = getCurrentUrl()

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("Envoi_Frs_Dechet_Reste: session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]); 

  async function fetchAllData() {
    try {
      const response = await fetch_Envoi_Frs_Dechet_Reste()
      const data : Envoi_Frs_Dechet_Reste_Type[] = await getResponseData(response, 'Envoi_Frs_Dechet_Reste api error')
      consoleInfo('Envoi_Frs_Dechet_Reste fetchAllData data ', data)
      return data;
    }
    catch (err) {
      throw err;
    }
  }

  const columns: Column<Envoi_Frs_Dechet_Reste_Type>[] = [
    { 
      accessor: 'ANNEE' as keyof Envoi_Frs_Dechet_Reste_Type,
      header: 'Année' , 
      width: 100,
      meta: { isPrimaryKey: true }
    },
    { 
      accessor: 'NO_DOS_EXP' as keyof Envoi_Frs_Dechet_Reste_Type,
      header: 'N° dossier' , 
      width: 100,
      meta: { isPrimaryKey: true }
    },
    { 
      accessor: 'NO_CMD_EXP' as keyof Envoi_Frs_Dechet_Reste_Type,
      header: 'N° commande',
      width: 100,
      meta: { isPrimaryKey: true }
    },
    { 
      accessor: 'DATE_CMD' as keyof Envoi_Frs_Dechet_Reste_Type,
      header: 'Date',
      width: 150
    },
    { 
      accessor: 'ARTICLE_CODE' as keyof Envoi_Frs_Dechet_Reste_Type,
      header: 'Article' , 
      width: 100,
    },
    { 
      accessor: 'QUANTITE' as keyof Envoi_Frs_Dechet_Reste_Type,
      header: 'Quantité' , 
      width: 100,
    },
  ];

  return (
    <GenericMemListPage<Envoi_Frs_Dechet_Reste_Type> {...props}
      title={`Reste des envois au fournisseur déchets`}
      columns={columns}
      isModalList={false}
      fetchAllData={fetchAllData}
    />
  )
};

export default Envoi_Frs_Dechet_Reste;