import React, { createContext, useCallback, useContext } from 'react';

import { useCustomerService } from './customerService';

interface DebitsConsultationContextData {
  toggleDebitsModal(): void;
}

const DebitsConsultationContext = createContext<DebitsConsultationContextData>(
  {} as DebitsConsultationContextData,
);

const DebitsConsultationProvider: React.FC = ({ children }) => {
  const { debits } = useCustomerService();

  const toggleDebitsModal = useCallback(() => {}, []);

  return (
    <DebitsConsultationContext.Provider
      value={{
        toggleDebitsModal,
      }}
    >
      {children}
    </DebitsConsultationContext.Provider>
  );
};

function useDebitsConsultation(): DebitsConsultationContextData {
  const context = useContext(DebitsConsultationContext);

  if (!context) {
    throw new Error(
      'useDebitsConsultation must be used within a DebitsConsultationProvider',
    );
  }

  return context;
}

export { DebitsConsultationProvider, useDebitsConsultation };
