import React, { createContext, useCallback, useContext } from 'react';
import { v4 as uuid } from 'uuid';

import eqtlBarApi from '../services/eqtlBarApi';

interface PowerOutageServiceContextData {
  generatePowerOutageService({
    contract,
    protocol,
    descriptionText,
    reference,
    operatingCompany,
  }: GeneratePowerOutageProps): Promise<void>;
}

interface GeneratePowerOutageProps {
  type: 'complete' | 'power surge' | 'lack of phase';
  contract: string;
  protocol: string;
  descriptionText: string;
  reference: string;
  operatingCompany: string;
}

const PowerOutageServiceContext = createContext<PowerOutageServiceContextData>(
  {} as PowerOutageServiceContextData,
);

const PowerOutageServiceProvider: React.FC = ({ children }) => {
  const generatePowerOutageService = useCallback(
    async ({
      type,
      contract,
      protocol,
      descriptionText,
      reference,
      operatingCompany,
    }: GeneratePowerOutageProps) => {
      let path;

      switch (type) {
        case 'complete':
          path = '/servico/v1/faltaenergia/completa';
          break;
        case 'power surge':
          path = '/servico/v1/faltaenergia/oscilacao';
          break;
        case 'lack of phase':
          path = '/servico/v1/faltaenergia/faltaFases';
          break;
        default:
          return;
      }

      await eqtlBarApi.post(
        path,
        {
          codigoTransacao: uuid(),
          data: {
            contaContrato: contract,
            protocolo: protocol,
            textoDescritivo: descriptionText,
            referencia: reference,
          },
        },
        {
          params: {
            empresaOperadora: operatingCompany,
          },
        },
      );
    },
    [],
  );

  return (
    <PowerOutageServiceContext.Provider
      value={{
        generatePowerOutageService,
      }}
    >
      {children}
    </PowerOutageServiceContext.Provider>
  );
};

function usePowerOutageService(): PowerOutageServiceContextData {
  const context = useContext(PowerOutageServiceContext);

  if (!context) {
    throw new Error(
      'usePowerOutageService must be used within a PowerOutageServiceProvider',
    );
  }

  return context;
}

export { PowerOutageServiceProvider, usePowerOutageService };
