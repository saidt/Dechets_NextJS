'use client';

import { Typography, Container, styled, Paper, Stack } from '@mui/material';
import NextVersionDisplay from '@/ui/version/NextVersion';
import NextAuthVersionDisplay from '@/ui/version/NextAuthVersion';
import ReactVersionDisplay from '@/ui/version/ReactVersion';
import AppVersionDisplay from '@/ui/version/AppVersion';
import MuiVersionDisplay from '@/ui/version/MuiVersion';
import Libraries from './Libraries';

const StyledPaper = styled(Paper) ({
  height: 60,
  width: 300,
  lineHeight: '60px',
  paddingLeft: 10,
  marginBottom: 10
});

const About = () => {
  return (
    <Container maxWidth="lg">
      <br />
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        This is a standard Next.js Material UI app structure using App Router
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Styles copied from MaterialPro
      </Typography>
      <Typography sx={{ variant: "h5", fontWeight: "bold" }}>
        Libraries:
      </Typography>
      <Libraries />
      <br />
      <br />
      <Stack direction="row" spacing={2}>
        <StyledPaper>
          <AppVersionDisplay />
        </StyledPaper>
        <StyledPaper>
          <NextVersionDisplay />
        </StyledPaper>
        <StyledPaper>
          <NextAuthVersionDisplay />
        </StyledPaper>
        <StyledPaper>
          <ReactVersionDisplay />
        </StyledPaper>
        <StyledPaper>
          <MuiVersionDisplay />
        </StyledPaper>
      </Stack>
    </Container>
  );
}

export default About;