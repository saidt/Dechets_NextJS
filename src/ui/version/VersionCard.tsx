import { Card, CardContent, Typography, Stack, TypographyProps } from "@mui/material";

type VersionCardProps = {
  label: string;
  version: string;
  color: TypographyProps["color"];
};

export default function VersionCard({ label, version, color }: VersionCardProps) {
  return (
    <Card variant="outlined" sx={{ p: 0 }}>
      <CardContent>
        <Stack direction="row" spacing={2}>
          <Typography variant="subtitle1" color={color}>
            {label} Version: {version}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
