"use client";

import { clientError } from "@/lib/error";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
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

  const router = useRouter()
  const pathName = usePathname()

  const handleClick = () => {
    try {
      const error = new Error('Volontary thrown error !')
      throw error
    }
    catch (error: any) {
      clientError('Home', error, pathName,router)
    }
  }
  
  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography sx={{mb: 3}} >Page d'acceuil</Typography>
          <Box sx={{ textAlign: "center" }}>
            <Image
              src="/images/cables.png"
              alt="Câbles déchets"
              width={950}
              height={600}
            />
          </Box>
          <Button variant="contained" onClick={handleClick} sx={{mt: 3}}>
            Throw error
          </Button>
        </>
      )}
    </>
  );
}