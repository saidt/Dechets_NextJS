import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Box } from "@mui/material";
import DashboardCard from "../../shared/DashboardCard";
import { useEffect, useState } from "react";
import { getResponseData } from "@/lib/html";
import Loading from "@/components/ui/Loading";
import ErrorMsg from "@/components/ErrorMsg";
import { fetch_Sortie_Dechet_Poids_DataSet } from "@/fetch/sortie-dechet";

const SortieDechetPoidsChart = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const [xAxisData, setXAxisData] = useState<number[]>([]);
  const [series, setSeries] = useState<number[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
    
  useEffect(() => {
    async function fetchSortieDechetPoidsData() {
      setLoading(true)
      setError('')
      await new Promise((resolve) => setTimeout(resolve, 100));
      try {
        const response = await fetch_Sortie_Dechet_Poids_DataSet()
        const data = await getResponseData(response, 'Fetch Sortie Déchets Poids DataSet')
        setXAxisData(data.anneeMois);
        setSeries(data.poids);
        setTotal(data.total)
      }
      catch (err: any) {
        setError(`Fetch Sortie Déchets Poids DataSet: ${String(err)}`);
      }
      finally {
        setLoading(false)
      }
    }
    fetchSortieDechetPoidsData();
  }, []);

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "area",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    colors: [secondary],

    dataLabels: {
      enabled: false,
    },
    stroke: { curve: "smooth", show: !0, width: 2, colors: [secondary] },
    legend: {
      show: false,
    },
    fill: { type: "solid", opacity: 0.07, colors: [secondary] },
    xaxis: {
      categories: xAxisData,
      axisBorder: { show: !1 },
      axisTicks: { show: !1 },
      tickAmount: 6,
      labels: { rotate: 0, rotateAlways: !0, style: { fontSize: "12px", colors: "#a1aab2" } },
      crosshairs: { position: "front", stroke: { color: [primary, secondary], width: 1, dashArray: 3 } },
    },
    states: { normal: { filter: { type: "none", value: 0 } }, hover: { filter: { type: "none", value: 0 } }, active: { allowMultipleDataPointsSelection: !1, filter: { type: "none", value: 0 } } },
    grid: { borderColor: "var(--bs-border-color)", strokeDashArray: 4, yaxis: { lines: { show: !0 } } },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: "Poids",
      data: series,
    },
  ];

  return (
    <DashboardCard
      title="Poids des sortie déchets"
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
              <Box sx={{ height: "330px", mx: "-15px" }}>
                <Chart
                  options={optionscolumnchart}
                  series={seriescolumnchart}
                  type="area"
                  height={330}
                  width={"100%"}
                />
              </Box>
              <Stack sx={{ spacing: 3, mt: 1, justifyContent: "space-between" }}>
                <Box sx={{ textAlign: 'center', px: 8 }}>
                  <Typography sx={{ variant: "h3", fontSize: "30px" }}>{total.toLocaleString()}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">Poids total</Typography>
                </Box>
              </Stack>
            </>
          )}
        </>
      )}
    </DashboardCard>
  );
};


export default SortieDechetPoidsChart;