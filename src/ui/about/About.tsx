'use client';

import { Typography, Container, styled, Paper, Stack } from '@mui/material';
import { version as muiVersion } from '@mui/material';
import VersionCard from '@/ui/version/VersionCard';
import type { Versions } from '@/lib/versions';
import Libraries from './Libraries';

const StyledPaper = styled(Paper) ({
  height: 60,
  width: 300,
  lineHeight: '60px',
  paddingLeft: 10,
  marginBottom: 10
});

const About = ({ versions }: { versions: Versions }) => {
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
          <VersionCard label="App" version={versions.app} color="primary" />
        </StyledPaper>
        <StyledPaper>
          <VersionCard label="Next.js" version={versions.next} color="secondary" />
        </StyledPaper>
        <StyledPaper>
          <VersionCard label="NextAuth" version={versions.nextAuth} color="success" />
        </StyledPaper>
        <StyledPaper>
          <VersionCard label="React" version={versions.react} color="info" />
        </StyledPaper>
        <StyledPaper>
          <VersionCard label="Material UI" version={muiVersion ?? "unknown"} color="warning" />
        </StyledPaper>
      </Stack>
    </Container>
  );
}

export default About;