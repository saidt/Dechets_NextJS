'use client'

import PageContainer from '@/components/container/PageContainer';
import { Box, Button, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import { useEffect } from 'react';
import { localLog } from '@/components/logger/localLog';
import { getAllCookies } from '@/lib/html';

export default function Error() {
  
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'An error has occurred';
  const path = searchParams.get('path') ;
  //consoleInfo('ErrorPage path : ', path);

  const router = useRouter();

  const handleGoBack = () => {
    if (path)  {
      router.push(path)
    }
    else {
      router.back()
    }
  }

  const allCookies = getAllCookies();

  useEffect(() => {
    localLog("error", message, allCookies, {});
  }, [message]);

  return (
    <PageContainer title="Error">
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center',
        p: 4,
      }}>
        <Image
          src={"/images/error.png"}
          alt="404" width={100} height={100}
          style={{ width: "100%", maxWidth: "100px",  maxHeight: '100px' }}
        />
        <Typography align="center" variant="h4" sx={{ m: 3 }}>
          {decodeURIComponent(message)}
        </Typography>
        <Button variant="contained" onClick={handleGoBack}>
          Go Back
        </Button>
      </Box>
    </PageContainer>
  );
}