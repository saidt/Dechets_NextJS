"use client"

import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, Divider } from '@mui/material';
import { useContext } from 'react';
import { CustomizerContext } from "@/app/context/customizerContext";

const TitleCard = ({ title, children }: any) => {
    const theme = useTheme();
    const borderColor = theme.palette.divider;
    const { isCardShadow } = useContext(CustomizerContext);

    return (
        <Card
            sx={{ padding: 0, border: !isCardShadow ? `1px solid ${borderColor}` : 'none' }}
            elevation={isCardShadow ? 9 : 0}
            variant={!isCardShadow ? 'outlined' : undefined}
        >
            <CardHeader
                sx={{
                    padding: '16px',
                }}
                title={title}
            />
            <Divider />
            {children}
        </Card>
    );
};

export default TitleCard;