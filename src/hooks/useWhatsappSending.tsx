import React, { createContext, useCallback, useContext } from 'react';
import { v4 as uuid } from 'uuid';

const urlVariations = {
  '98': {
    url:
      'https://services-int-ocp.equatorialenergia.com.br/api/parceiro/yalo/webhook/cemar',
    token:
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ5YWxvY2hhdF9hdXRoIiwiZXhwIjoxNTUzNzM1NjIwLCJpYXQiOjE1NTEzMTY0MjAsImlzcyI6InlhbG9jaGF0X2F1dGgiLCJqdGkiOiJlNjM2MmVmYS01ZDRlLTQ0Y2EtODE0OS0xMmQ0ZGY3MmViNWIiLCJuYmYiOjE1NTEzMTY0MTksInN1YiI6IjVjNzczNWMxMzdhZGE5MDAwODg1OWIwMSIsInR5cCI6ImFjY2VzcyJ9.ExSTxYepjNNi1NWV_MtC_g87NEmZz7tAPpeGHLfre9IkiI3oC2np945L9nCTTzleqgjJ9kWUNscdJaaEIy6SPg',
  },
  '95': {
    url:
      'https://services-int-ocp.equatorialenergia.com.br/api/parceiro/yalo/webhook/cemar',
    token:
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ5YWxvY2hhdF9hdXRoIiwiZXhwIjoxNTUzNzM1NjIwLCJpYXQiOjE1NTEzMTY0MjAsImlzcyI6InlhbG9jaGF0X2F1dGgiLCJqdGkiOiJlNjM2MmVmYS01ZDRlLTQ0Y2EtODE0OS0xMmQ0ZGY3MmViNWIiLCJuYmYiOjE1NTEzMTY0MTksInN1YiI6IjVjNzczNWMxMzdhZGE5MDAwODg1OWIwMSIsInR5cCI6ImFjY2VzcyJ9.ExSTxYepjNNi1NWV_MtC_g87NEmZz7tAPpeGHLfre9IkiI3oC2np945L9nCTTzleqgjJ9kWUNscdJaaEIy6SPg',
  },
  '82': {
    url:
      'https://services-int-ocp.equatorialenergia.com.br/api/parceiro/yalo/webhook/cemar',
    token:
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ5YWxvY2hhdF9hdXRoIiwiZXhwIjoxNTUzNzM1NjIwLCJpYXQiOjE1NTEzMTY0MjAsImlzcyI6InlhbG9jaGF0X2F1dGgiLCJqdGkiOiJlNjM2MmVmYS01ZDRlLTQ0Y2EtODE0OS0xMmQ0ZGY3MmViNWIiLCJuYmYiOjE1NTEzMTY0MTksInN1YiI6IjVjNzczNWMxMzdhZGE5MDAwODg1OWIwMSIsInR5cCI6ImFjY2VzcyJ9.ExSTxYepjNNi1NWV_MtC_g87NEmZz7tAPpeGHLfre9IkiI3oC2np945L9nCTTzleqgjJ9kWUNscdJaaEIy6SPg',
  },
  '86': {
    url:
      'https://services-int-ocp.equatorialenergia.com.br/api/parceiro/yalo/webhook/cemar',
    token:
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ5YWxvY2hhdF9hdXRoIiwiZXhwIjoxNTUzNzM1NjIwLCJpYXQiOjE1NTEzMTY0MjAsImlzcyI6InlhbG9jaGF0X2F1dGgiLCJqdGkiOiJlNjM2MmVmYS01ZDRlLTQ0Y2EtODE0OS0xMmQ0ZGY3MmViNWIiLCJuYmYiOjE1NTEzMTY0MTksInN1YiI6IjVjNzczNWMxMzdhZGE5MDAwODg1OWIwMSIsInR5cCI6ImFjY2VzcyJ9.ExSTxYepjNNi1NWV_MtC_g87NEmZz7tAPpeGHLfre9IkiI3oC2np945L9nCTTzleqgjJ9kWUNscdJaaEIy6SPg',
  },
};

interface WhatsappSendingContextData {
  sendInvoiceDebit({
    operatingCompany,
    invoiceUrl,
    phoneNumber,
  }: SendInvoiceDebitProps): void;
}

interface SendInvoiceDebitProps {
  operatingCompany: string;
  invoiceUrl: string;
  phoneNumber: string;
}

const WhatsappSendingContext = createContext<WhatsappSendingContextData>(
  {} as WhatsappSendingContextData,
);

const WhatsappSendingProvider: React.FC = ({ children }) => {
  const sendInvoiceDebit = useCallback(
    async ({
      operatingCompany,
      invoiceUrl,
      phoneNumber,
    }: SendInvoiceDebitProps) => {
      console.log({
        operatingCompany,
        invoiceUrl,
        phoneNumber,
      });
    },
    [],
  );

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
