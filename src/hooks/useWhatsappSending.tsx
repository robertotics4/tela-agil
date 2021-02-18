import React, { createContext, useCallback, useContext } from 'react';
import { v4 as uuid } from 'uuid';

import { useDebitsConsultation } from './debitsConsultation';

interface WhatsappSendingContextData {
  sendInvoiceDebit(): Promise<void>;
}

const WhatsappSendingContext = createContext<WhatsappSendingContextData>(
  {} as WhatsappSendingContextData,
);

const WhatsappSendingProvider: React.FC = ({ children }) => {
  const { getInvoiceUrl } = useDebitsConsultation();

  const sendInvoiceDebit = useCallback(async () => {}, []);

  return (
    <WhatsappSendingContext.Provider
      value={{
        sendInvoiceDebit,
      }}
    >
      {children}
    </WhatsappSendingContext.Provider>
  );
};

function useWhatsappSending(): WhatsappSendingContextData {
  const context = useContext(WhatsappSendingContext);

  if (!context) {
    throw new Error(
      'useWhatsappSending must be used within a WhatsappSendingProvider',
    );
  }

  return context;
}

export { WhatsappSendingProvider, useWhatsappSending };
