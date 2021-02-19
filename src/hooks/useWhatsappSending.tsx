import React, { createContext, useCallback, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import yaloApi from '../services/yaloApi';

interface UrlVariationsProps {
  [operatingCompany: string]: {
    id: string;
    token: {
      activeSession: string;
      noSession: string;
    };
  };
}

const urlVariations: UrlVariationsProps = {
  '98': {
    id: 'equatorial-cemar',
    token: {
      activeSession:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ5YWxvY2hhdF9hdXRoIiwiZXhwIjoxNTUzNzM1NjIwLCJpYXQiOjE1NTEzMTY0MjAsImlzcyI6InlhbG9jaGF0X2F1dGgiLCJqdGkiOiJlNjM2MmVmYS01ZDRlLTQ0Y2EtODE0OS0xMmQ0ZGY3MmViNWIiLCJuYmYiOjE1NTEzMTY0MTksInN1YiI6IjVjNzczNWMxMzdhZGE5MDAwODg1OWIwMSIsInR5cCI6ImFjY2VzcyJ9.ExSTxYepjNNi1NWV_MtC_g87NEmZz7tAPpeGHLfre9IkiI3oC2np945L9nCTTzleqgjJ9kWUNscdJaaEIy6SPg',
      noSession:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJUNUtNbHBiSGpKQ2RQSUtmdFZ5SUJBem5IUEllcThyMCJ9.EDZ45MU8V6tlEvAv1KAZeLtAwRSJgSg2bo5VzwNzdRE',
    },
  },
  '95': {
    id: 'equatorial-celpa',
    token: {
      activeSession:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ5YWxvY2hhdF9hdXRoIiwiZXhwIjoxNTU1MDM2OTM1LCJpYXQiOjE1NTI2MTc3MzUsImlzcyI6InlhbG9jaGF0X2F1dGgiLCJqdGkiOiI2Y2JjN2I0OC03YzYwLTRjOTgtOGQwNy1jODAxZmE0MmRhMzUiLCJuYmYiOjE1NTI2MTc3MzQsInN1YiI6IjVjOGIwZjcyZTU3M2ZjMDAwOTE0NjA1MiIsInR5cCI6ImFjY2VzcyJ9.mU7bgLdmcdFgxt017Ds2UrlNyUNzy31irOyLQTJwVSoeGo7ejKwzN0ctpV6Ntm3rGkF4G_xnI1T8Ua0hPZP1WQ',
      noSession:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJUNUtNbHBiSGpKQ2RQSUtmdFZ5SUJBem5IUEllcThyMCJ9.EDZ45MU8V6tlEvAv1KAZeLtAwRSJgSg2bo5VzwNzdRE',
    },
  },
  '82': {
    id: 'equatorial-alagoas',
    token: {
      activeSession:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ5YWxvY2hhdF9hdXRoIiwiYm90IjoiZXF1YXRvcmlhbC1hbGFnb2FzIiwiZXhwIjoxNTcwMDQyMzIxLCJpYXQiOjE1Njc2MjMxMjEsImlzcyI6InlhbG9jaGF0X2F1dGgiLCJqdGkiOiI2NWQ1OGQ0Zi03MDM0LTRjNGItOWYyNS0yYzRmMTdjMzYwN2EiLCJuYmYiOjE1Njc2MjMxMjAsInN1YiI6IjVkNzAwN2M4NmM5OGFhMDAwOTBlZDc3ZiIsInR5cCI6ImFjY2VzcyJ9.VTPLnWo7zJYDMlrywLVN1LV36rFA7C6NfLmoIOxy8WyyHsenon5C7gALbgfwtZnmtHnvz-ERNzVtcYewlgOl0A',
      noSession:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJUNUtNbHBiSGpKQ2RQSUtmdFZ5SUJBem5IUEllcThyMCJ9.EDZ45MU8V6tlEvAv1KAZeLtAwRSJgSg2bo5VzwNzdRE',
    },
  },
  '86': {
    id: 'equatorial-piaui',
    token: {
      activeSession:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ5YWxvY2hhdF9hdXRoIiwiYm90IjoiZXF1YXRvcmlhbC1waWF1aSIsImV4cCI6MTU3MDA0MjIzNiwiaWF0IjoxNTY3NjIzMDM2LCJpc3MiOiJ5YWxvY2hhdF9hdXRoIiwianRpIjoiNDBhNWRjMGUtZDQwZS00OGM0LTkzMTQtY2ViMzQ4MTJlNDk3IiwibmJmIjoxNTY3NjIzMDM1LCJzdWIiOiI1ZDcwMDcxMWZlZTExNTAwMGJhZTJhNjkiLCJ0eXAiOiJhY2Nlc3MifQ.-M94J42QltLdAHuHxyiz-BaFR6EfxHfUA8Z89Jblp6udxL-xIHn8yhDUCUL7nGrPxfMhbR6nJAf6Rg4EsujVZQ',
      noSession:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJUNUtNbHBiSGpKQ2RQSUtmdFZ5SUJBem5IUEllcThyMCJ9.EDZ45MU8V6tlEvAv1KAZeLtAwRSJgSg2bo5VzwNzdRE',
    },
  },
};

interface WhatsappSendingContextData {
  sendInvoiceDebit({
    operatingCompany,
    invoiceUrl,
    phoneNumber,
  }: SendInvoiceDebitProps): Promise<void>;
}

interface SendInvoiceDebitProps {
  operatingCompany: string;
  invoiceUrl: string;
  phoneNumber: string;
}

interface SendNotificationProps {
  operatingCompany: string;
  phoneNumber: string;
}

const WhatsappSendingContext = createContext<WhatsappSendingContextData>(
  {} as WhatsappSendingContextData,
);

const WhatsappSendingProvider: React.FC = ({ children }) => {
  const sendNotification = useCallback(
    async ({ operatingCompany, phoneNumber }: SendNotificationProps) => {
      const { id, token } = urlVariations[operatingCompany];

      const payload = JSON.stringify({
        type: 'entrada-parcelamento"',
        users: [
          {
            phone: `55${phoneNumber}`,
            params: {
              nomeCliente: 'teste',
              contaContrato: 'teste',
              valorEntrada: 'teste',
              codBarras: 'teste',
            },
          },
        ],
      });

      console.log(payload);

      await yaloApi.post(
        `/accounts/equatorial/bots/${id}/notifications`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token.noSession}`,
          },
        },
      );
    },
    [],
  );

  const sendInvoiceDebit = useCallback(
    async ({
      operatingCompany,
      invoiceUrl,
      phoneNumber,
    }: SendInvoiceDebitProps) => {
      const { id, token } = urlVariations[operatingCompany];

      await sendNotification({
        operatingCompany,
        phoneNumber,
      });

      await yaloApi.post(
        `/outgoing_webhook/bots/${id}/messages`,
        {
          id: uuid(),
          preview_url: true,
          type: 'document',
          document: {
            url: invoiceUrl,
            type: 'document',
            caption: '2ª via de fatura',
          },
          userId: `55${phoneNumber}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token.activeSession}`,
          },
        },
      );
    },
    [sendNotification],
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
