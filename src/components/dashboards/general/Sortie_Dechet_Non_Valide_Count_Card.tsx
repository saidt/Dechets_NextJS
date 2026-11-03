import { Box, CardContent, Card, Typography, Stack, Grid } from "@mui/material";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { getResponseData } from "@/lib/html";
import Loading from "@/components/ui/Loading";
import ErrorMsg from "@/components/ErrorMsg";
import { fetch_Sortie_Dechet_Non_Valide_Count } from "@/fetch/sortie-dechet";

const Sortie_Dechet_Non_Valide_CountCard = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchSortieDechetNonValideData() {
      setLoading(true)
      setError('');
      await new Promise((resolve) => setTimeout(resolve, 100));
      try {
        const response = await fetch_Sortie_Dechet_Non_Valide_Count();
        const data = await getResponseData(response, 'Fetch Sortie Déchets Non Validé Count')
        setCount(data.count);
      }
      catch (err: any) {
        setError(`Fetch Sortie Déchets Non Validé Count: ${String(err)}`);
      }
      finally {
        setLoading(false)
      }
    }
    fetchSortieDechetNonValideData();
  }, []);
  
  return (
    <Card variant="outlined" sx={{ p: 0, bgcolor: "info.main" }}>
      <CardContent>
        <Stack sx={{ direction: "row", alignItems: "center", spacing: 2, mb: 3 }}>
          <Box
            sx={{
              backgroundColor: "rgba(0,0,0,0.1)",
              width: "48px",
              height: "48px",
              borderRadius: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Icon
              icon="solar:chart-broken"
              width={24}
              height={24}
            />
          </Box>
          <Box>
            <Typography color="white" variant="h5">
              Nombre des sorties déchets non validées
            </Typography>
          </Box>
        </Stack>
        <Grid container spacing={3}>
          <Grid sx={{ display: "flex", alignItems: "center" }} size={5}>
            {loading ? (
              <Loading />
            ) : (
              <>
                {error ? (                  
                  <ErrorMsg error={error} />
                ) : (
                  <Typography sx={{ variant: "h5", fontWeight: "400", fontSize: "30px", color: "white" }}>
                    {count.toLocaleString()}
                  </Typography>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Sortie_Dechet_Non_Valide_CountCard;