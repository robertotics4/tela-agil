import React, { createContext, useCallback, useContext } from 'react';
import { v4 as uuid } from 'uuid';

import eqtlBarApi from '../services/eqtlBarApi';

import { useCustomerService } from './customerService';

interface DebitsConsultationContextData {
  getInvoiceUrl({
    invoiceReference,
    operatingCompany,
  }: DuplicateInvoiceProps): Promise<string>;
}

interface DuplicateInvoiceProps {
  invoiceReference: string;
  operatingCompany: string;
}

const DebitsConsultationContext = createContext<DebitsConsultationContextData>(
  {} as DebitsConsultationContextData,
);

const DebitsConsultationProvider: React.FC = ({ children }) => {
  const getInvoiceUrl = useCallback(
    async ({ invoiceReference, operatingCompany }: DuplicateInvoiceProps) => {
      const response = await eqtlBarApi.get(
        `/fatura/v1/segundaVia/${invoiceReference}`,
        {
          params: {
            empresaOperadora: operatingCompany,
            codigoTransacao: uuid(),
          },
        },
      );
      return response.data.data.urlFatura;
    },
    [],
  );

  return (
    <DebitsConsultationContext.Provider
      value={{
        getInvoiceUrl,
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
