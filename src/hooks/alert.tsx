import React, { createContext, useCallback, useContext, useState } from 'react';

import AlertModal from '../components/AlertModal';

interface AlertContextData {
  customAlert(message: AlertMessage): void;
}

export interface AlertMessage {
  type?: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description: string;
  confirmationText: string;
  cancelButtonText?: string;
  confirmationAction?(): void;
  cancelAction?(): void;
}

const AlertContext = createContext<AlertContextData>({} as AlertContextData);

const AlertProvider: React.FC = ({ children }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage>(
    {} as AlertMessage,
  );

  const toggleAlert = useCallback(() => {
    setAlertOpen(state => !state);
  }, []);

  const customAlert = useCallback(
    (message: AlertMessage) => {
      setAlertMessage(message);
      toggleAlert();
    },
    [toggleAlert],
  );

  return (
    <AlertContext.Provider value={{ customAlert }}>
      {children}

      {alertOpen && (
        <AlertModal
          message={alertMessage}
          isOpen={alertOpen}
          setIsOpen={toggleAlert}
        />
      )}
    </AlertContext.Provider>
  );
};

function useAlert(): AlertContextData {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }

  return context;
}

export { AlertProvider, useAlert };
