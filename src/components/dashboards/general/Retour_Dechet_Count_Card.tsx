import { Box, CardContent, Card, Typography, Stack, Grid } from "@mui/material";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { getResponseData } from "@/lib/html";
import Loading from "@/components/ui/Loading";
import ErrorMsg from "@/components/ErrorMsg";
import { fetch_Retour_Dechet_Count } from "@/fetch/retour-dechet";

const RetourDechetCountCard = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchRetourDechetData() {
      setLoading(true)
      setError('')
      await new Promise((resolve) => setTimeout(resolve, 100));
      try {
        const response = await fetch_Retour_Dechet_Count()
        const data = await getResponseData(response, 'Fetch Retour Déchet Count')
        setCount(data.count);
      }
      catch (err: any) {
        setError(`Fetch Retour Déchet Count: ${String(err)}`);
      }
      finally {
        setLoading(false)
      }
    }
    fetchRetourDechetData();
  }, []);

  return (
    <Card variant="outlined" sx={{ p: 0, bgcolor: "secondary.main" }}>
      <CardContent>
        <Stack sx={{ direction: "row", alignItems: "center", spacing: 2, mb: 3 }}>
          <Box
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
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
              icon="solar:chart-linear"
              width={24}
              height={24}
              color="white"
            />
          </Box>
          <Box>
            <Typography color="white" variant="h5">
              Nombre des retours déchets
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

export default RetourDechetCountCard;