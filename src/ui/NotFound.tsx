"use client"

import PageContainer from "@/components/container/PageContainer";
import { Box, Container, Typography, Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  return (
    <PageContainer title="Not found">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="md">
          <Image
            src={"/images/404.png"}
            alt="404" width={100} height={100}
            style={{ width: "100%", maxWidth: "100px",  maxHeight: '100px' }}
          />
          <Typography align="center" variant="h4" sx={{ m: 3 }}>
            This page you are looking for could not be found.
          </Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={() => router.back()}
            href="/"
            disableElevation
          >
            Go Back
          </Button>
        </Container>
      </Box>
    </PageContainer>
  )
};

export default NotFound;