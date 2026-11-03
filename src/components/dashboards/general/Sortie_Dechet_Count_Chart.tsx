import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { useTheme } from "@mui/material/styles";
import { Box, Stack, Typography } from "@mui/material";
import DashboardCard from "../../shared/DashboardCard";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { getResponseData } from "@/lib/html";
import Loading from "@/components/ui/Loading";
import ErrorMsg from "@/components/ErrorMsg";
import { fetch_Sortie_Dechet_Count_DataSet } from "@/fetch/sortie-dechet";

const Sortie_Dechet_Count_Chart = () => {
  const [xAxisData, setXAxisData] = useState<number[]>([]);
  const [series, setSeries] = useState<number[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
    
  useEffect(() => {
    async function fetchSortie_Dechet_CountData() {
      setLoading(true)
      setError('');
      await new Promise((resolve) => setTimeout(resolve, 100));
      try {
        const response = await fetch_Sortie_Dechet_Count_DataSet()
        const data = await getResponseData(response, 'Fetch Sortie Déchets Count DataSet')
        setXAxisData(data.anneeMois);
        setSeries(data.nombres);
        setTotal(data.total)

      }
      catch (err: any) {
        setError(`Fetch Sortie Déchet Count DataSet: ${String(err)}`);
      }
      finally {
        setLoading(false)
      }
    }
    fetchSortie_Dechet_CountData();
  }, []);

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // chart
  const optionscolumnchart: ApexOptions = {

    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 6,
        columnWidth: "35%",
      },
    },

    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: "rgba(0,0,0,.1)",
    },
    colors: [primary, secondary],
    chart: {
      width: 70,
      height: 40,
      foreColor: "#adb0bb",
      fontFamily: "inherit",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "category",
      categories: xAxisData,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: true,
    },
  };
  const seriescolumnchart = [
    { name: "Sortie Déchets count", data: series },
  ];

  return (
    <DashboardCard
      title="Nombre des sorties Déchets"
      subtitle="Derniers 12 mois"
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          {error ? (                  
            <ErrorMsg error={error} />
          ) : (
            <>
              <Box sx={{ height: "295px" }}>
                <Chart
                  options={optionscolumnchart}
                  series={seriescolumnchart}
                  type="bar"
                  height={295}
                  width={"100%"}
                />
              </Box>

              <Stack  sx={{ spacing: 3, mt: 1, justifyContent: "space-between" }}>
                <Box sx={{ textAlign: 'center', px: 8 }}>
                  <Typography sx={{ variant: "h3", fontSize: "30px" }}>{total.toLocaleString()}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">Nombre total</Typography>
                </Box>
              </Stack>
            </>
          )}
        </>
      )}
    </DashboardCard >
  );
};

export default Sortie_Dechet_Count_Chart;