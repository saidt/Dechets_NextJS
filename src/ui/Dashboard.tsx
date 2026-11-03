"use client";

import { Grid, Box } from "@mui/material";
import Sortie_Dechet_Count_Chart from "@/components/dashboards/general/Sortie_Dechet_Count_Chart";
import SortieDechetPoidsChart from "@/components/dashboards/general/Sortie_Dechet_Poids_Chart";
import RetourDechetCountCard from "@/components/dashboards/general/Retour_Dechet_Count_Card";
import Weather_CardCard from "@/components/dashboards/general/Weather_Card";
import Sortie_Dechet_Dernier_Table from "@/components/dashboards/general/Sortie_Dechet_Dernier_Table";
import Sortie_Dechet_CountCard from "@/components/dashboards/general/Sortie_Dechet_Count_Card";
import Sortie_Dechet_Non_Valide_CountCard from "@/components/dashboards/general/Sortie_Dechet_Non_Valide_Count_Card";
import Retour_Dechet_Non_Valide_CountCard from "@/components/dashboards/general/Retour_Dechet_Non_Valide_Count_Card";
import Welcome from "@/app/(DashboardLayout)/shared/welcome/Welcome";

export default function Dashboard() {

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 12,
            lg: 3,
          }}
        >
          <Sortie_Dechet_CountCard />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 3,
          }}
        >
          <RetourDechetCountCard />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 3,
          }}
        >
          <Sortie_Dechet_Non_Valide_CountCard />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 3,
          }}
        >
          <Retour_Dechet_Non_Valide_CountCard  />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 8,
          }}
        >
          <Sortie_Dechet_Count_Chart />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <Weather_CardCard />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 8,
          }}
        >
          <SortieDechetPoidsChart />
        </Grid>

        <Grid size={12}>
          <Sortie_Dechet_Dernier_Table />
        </Grid>
      </Grid>
      <Welcome />
    </Box>
  );
}