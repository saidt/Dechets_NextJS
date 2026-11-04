"use client";

import { getResponseData } from "@/lib/html";
import { GenericMemListPage } from "@/components/datatable/GenericMemListPage";
import { Column } from "@/lib/types";
import { useSession } from "next-auth/react";
import MuiDialog from "@/components/ui/dialog/MuiDialog";
import { DialogProps } from "@mui/material";
import { fetch_Sortie_Dechet_Maj_Prix_Detail } from "@/fetch/sortie-dechet";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { clientError } from "@/lib/error";
import { useAppContext } from "@/app/context/AppContext";

interface CmsDialogProps extends DialogProps {
  numero: number
}

const Sortie_Dechet_Maj_Prix_Detail = ({numero, ...restProps}: CmsDialogProps) => {

  const { data: session, status } = useSession()
  const router =  useRouter()
  const { getCurrentUrl } = useAppContext();
  const curUrl = getCurrentUrl()

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("GenericShowPage: session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]); 

  type Maj_Prix_Detail_Type = {
    SORTIE_DECHET_NUMERO: Number;
    LIGNE_NUMERO: Number;
    ARTICLE_CODE: String;
    ARTICLE_DESIGNATION: String;
    POIDS: Number;
    ML: Number;
    PRIX_VENTE: Number;
    MONTANT: Number;
  };

  // Stable identity: the GET runs the price update stored proc, so it must only
  // run when the list is mounted, not on every re-render.
  const fetchAllData = useCallback(async () => {
    const response = await fetch_Sortie_Dechet_Maj_Prix_Detail(numero)
    const data : Maj_Prix_Detail_Type[] = await getResponseData(response, 'Sortie_Dechet_Maj_Prix_Detail api error')
    return data;
  }, [numero]);

  const columns: Column<Maj_Prix_Detail_Type>[] = [
    { 
      accessor: 'SORTIE_DECHET_NUMERO' as keyof Maj_Prix_Detail_Type,
      header: 'Sortie' , 
      width: 100,
      meta: { isPrimaryKey: true }
    },
    { 
      accessor: 'LIGNE_NUMERO' as keyof Maj_Prix_Detail_Type,
      header: 'Ligne' , 
      width: 100,
      meta: { isPrimaryKey: true }
    },
    { 
      accessor: 'ARTICLE_CODE' as keyof Maj_Prix_Detail_Type,
      header: 'Article',
      width: 120
    },
    { 
      accessor: 'ARTICLE_DESIGNATION' as keyof Maj_Prix_Detail_Type,
      header: 'Désignation',
      width: 300 
    },
    { 
      accessor: 'POIDS' as keyof Maj_Prix_Detail_Type,
      header: 'Poids' , 
      width: 100,
    },
    { 
      accessor: 'KG_KM' as keyof Maj_Prix_Detail_Type,
      header: 'Kg/Km' , 
      width: 100,
    },
    { 
      accessor: 'ML' as keyof Maj_Prix_Detail_Type,
      header: 'M.L.' , 
      width: 100,
    },
    { 
      accessor: 'PRIX_VENTE' as keyof Maj_Prix_Detail_Type,
      header: 'P.U.V.' , 
      width: 100,
      meta: { decimals: 2 },
    },
    { 
      accessor: 'MONTANT' as keyof Maj_Prix_Detail_Type,
      header: 'Montant' , 
      width: 100,
      meta: { decimals: 2 },
    },
  ];


  return (
    <MuiDialog {...restProps}
      title="Màj des prix du détail"
      children={
        // Rendered as an element, not as a component declared inside this one:
        // a component declared here gets a new identity on every re-render
        // (e.g. after a notification), which remounted the list, re-ran the
        // stored proc and, on error, notified again in an endless loop.
        <GenericMemListPage<Maj_Prix_Detail_Type>
          title={`Màj prix détail sortie déchets ${numero}`}
          columns={columns}
          isModalList={false}
          fetchAllData={fetchAllData}
        />
      }
    />
  );
};

export default Sortie_Dechet_Maj_Prix_Detail;