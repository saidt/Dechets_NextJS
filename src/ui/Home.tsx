"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
     async function wait() {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setLoading(false);
    }
    wait(); 
  }, []);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            Page d'accueil
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <Image
              src="/images/cables.png"
              alt="Câbles déchets"
              width={950}
              height={600}
            />
          </Box>
        </>
      )}
    </>
  );
}