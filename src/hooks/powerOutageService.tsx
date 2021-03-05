import React, { createContext, useCallback, useContext } from 'react';
import { v4 as uuid } from 'uuid';

import eqtlBarApi from '../services/eqtlBarApi';
import { useCustomerService } from './customerService';

interface PowerOutageServiceContextData {
  ableToPowerOutage(): boolean;
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
  const { serviceNotes, installation } = useCustomerService();

  const ableToPowerOutage = useCallback(() => {
    const reconnectionNotes = serviceNotes.openServiceNotes.find(
      note => note.type === 'RL',
    );

    const suspensionNotes = serviceNotes.openServiceNotes.find(
      note => note.type === 'SUSPENSÃO',
    ); // HARD CODDED

    const highVoltageNotes = serviceNotes.openServiceNotes.find(
      note => note.type === 'AT',
    );

    const powerOutageNotes = serviceNotes.openServiceNotes.find(
      note => note.type === 'FE',
    );

    const newEnergyConnection = serviceNotes.openServiceNotes.find(
      note => note.type === 'FE',
    );

    if (
      reconnectionNotes ||
      installation.cutInProgress ||
      suspensionNotes ||
      installation.status !== 'Ligada' ||
      installation.scheduledShutdown ||
      installation.powerPhaseOutage ||
      highVoltageNotes ||
      powerOutageNotes ||
      newEnergyConnection
    ) {
      return false;
    }

    return true;
  }, [serviceNotes, installation]);

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
        ableToPowerOutage,
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
