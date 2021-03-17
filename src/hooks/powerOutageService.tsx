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
      note =>
        note.type === 'RL' &&
        (note.status === 'RECE' || note.status === 'ABER'),
    );

    const suspensionNotes = serviceNotes.openServiceNotes.find(
      note =>
        note.type === 'SF' &&
        (note.status === 'RECE' || note.status === 'ABER'),
    );

    const newEnergyConnectionNotes = serviceNotes.openServiceNotes.find(
      note =>
        note.type === 'LN' &&
        (note.status === 'RECE' || note.status === 'ABER'),
    );

    if (
      reconnectionNotes ||
      suspensionNotes ||
      newEnergyConnectionNotes ||
      installation.cutInProgress ||
      installation.scheduledShutdown ||
      installation.powerPhaseOutage ||
      installation.powerOutageTechnicalEvaluation ||
      installation.individualPowerOutage ||
      installation.status === 'Religa em andamento' ||
      installation.status === 'Reativa em andamento'
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
