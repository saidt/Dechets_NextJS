"use client";

import { Box, Grid } from "@mui/material";
import DashboardCard from "@/components/shared/DashboardCard";
import { useEffect, useState } from "react";
import { getResponseData } from "@/lib/html";
import Loading from "@/components/ui/Loading";
import ErrorMsg from "@/components/ErrorMsg";
import { ReactMemTable } from "@/components/datatable/ReactMemTable";
import { Column, TableState } from "@/lib/types";
import { Sortie_Dechet_Dernier_Type } from "@/types/retour-dechet";
import { fetch_Sortie_Dechet_Dernier_DataSet } from "@/fetch/sortie-dechet";

const columns: Column<Sortie_Dechet_Dernier_Type>[] = [
  { accessor: "NUMERO", header: "Numéro", width: 100, meta: { isPrimaryKey: true } },
  { accessor: "CLIENT_CODE", header: "Client", width: 120 },
  { accessor: "DATE_PIECE", header: "Date sortie", width: 120 },
  { accessor: "ARTICLE_CODE", header: "Article", width: 100, meta: { align: 'left' } },
  { accessor: "ARTICLE_DESIGNATION", header: "Désignation", width: 250 },
  { accessor: "QUANTITE", header: "Quantité", width: 100 },
];

const Sortie_Dechet_Dernier_Table = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tableState, setTableState] = useState<
    TableState<Sortie_Dechet_Dernier_Type>
  >(() => {
    return {
      page: 0,
      pageSize: 10,
      sort: null,
      filter: {},
      quickSearch: "",
    };
  });

  useEffect(() => {
    async function fetchSortie_Dechet_Dernier() {
      setLoading(true);
      setError("");
      await new Promise((resolve) => setTimeout(resolve, 100));
      try {
        const response = await fetch_Sortie_Dechet_Dernier_DataSet()
        const data = await getResponseData(
          response,
          "Fetch Sortie Dechet Dernières",
        );
        setData(data);
      } catch (err: any) {
        setError(`Fetch Sortie Dechet Dernières: ${String(err)}`);
      } finally {
        setLoading(false);
      }
    }
    fetchSortie_Dechet_Dernier();
  }, []);

  return (
    <DashboardCard title="Dix dernières sorties déchets">
      <Grid container spacing={3}>
        <Grid size={12}>
          <Box>
            {loading ? (
              <Loading />
            ) : (
              <>
                {error ? (
                  <ErrorMsg error={error} />
                ) : (
                  <ReactMemTable<Sortie_Dechet_Dernier_Type>
                    columns={columns}
                    allData={data}
                    tableState={tableState}
                    loading={loading}
                    onTableStateChange={setTableState}
                  />
                )}
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default Sortie_Dechet_Dernier_Table;