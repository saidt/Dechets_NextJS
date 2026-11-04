import React, { useState, useEffect } from 'react';
import { Box, Alert, Stack, IconButton } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from '@/app/context/AppContext';
import { Notification } from '@/lib/types';
import { ALTERT_TIME } from '@/lib/consts';
import { consoleDebug } from '@/lib/clientLog';

interface AlertItemProps {
  notification: Notification;
  onRemove: (id: number) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ notification, onRemove }) => {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (pinned) return;

    const timer = setTimeout(() => {
      onRemove(notification.id);
    }, ALTERT_TIME);

    return () => clearTimeout(timer);
  }, [pinned, notification.id, onRemove]);

  return (
    <Alert
      severity={notification.severity}
      variant="outlined"
      sx={(theme) => ({
        width: '100%',
        color: theme.palette[notification.severity].main,
        borderColor: theme.palette[notification.severity].main,
        '& .MuiAlert-icon': {
          color: theme.palette[notification.severity].main,
        },
      })}
      action={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            aria-label={pinned ? "Unpin" : "Pin"}
            size="small"
            onClick={() => setPinned(!pinned)}
            color={pinned ? "primary" : "inherit"}
            sx={{ opacity: pinned ? 1 : 0.6, '&:hover': { opacity: 1 } }}
          >
            {pinned ? <PushPinIcon fontSize="inherit" /> : <PushPinOutlinedIcon fontSize="inherit" />}
          </IconButton>
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => onRemove(notification.id)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
      }
    >
      {notification.message}
    </Alert>
  );
};

const AlertManager: React.FC = () => {
  const { notifications, removeNotification } = useAppContext();

  notifications.map((notification) => {
    consoleDebug(notification.severity);
  });

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80, // 64px (AppBar) + 16px margin
        right: 16,
        zIndex: (theme) => theme.zIndex.snackbar,
        width: '100%',
        maxWidth: 360,
      }}
    >
      <Stack spacing={1}>
        {notifications.map((notification) => (
          <AlertItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default AlertManager;