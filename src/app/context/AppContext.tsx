import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { AlertColor } from '@mui/material/Alert';
import { Notification } from '@/lib/types';

interface AppContextType {
  notifications: Notification[];
  addNotification: (message: string, severity?: AlertColor) => void;
  removeNotification: (id: number) => void;
  getCurrentUrl: () => string;
  //goBackUrl: string;
  //setGoBackUrl: (url: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUrl, setCurrentUrl] = useState('/');
  //const [goBackUrl, setGoBackUrl_] = useState<string>('/');
  
  const addNotification = useCallback((message: string, severity: AlertColor = 'success') => {
    const newNotification: Notification = {
      id: Date.now() + Math.random(),
      message,
      severity,
    };
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
  useEffect(() => {
    setCurrentUrl(sessionStorage.getItem('currentUrl') ?? '/');
  }, []);

  const getCurrentUrl = () => currentUrl;

  /*const setGoBackUrl = useCallback((url: string) => {
    setGoBackUrl_(url)
    consoleInfo('AppContext goBackUrl: ', goBackUrl)
  }, []);*/

  return (
    <AppContext.Provider value={{ 
      notifications,
      addNotification,
      removeNotification,
      getCurrentUrl
      //goBackUrl,
      //setGoBackUrl,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};