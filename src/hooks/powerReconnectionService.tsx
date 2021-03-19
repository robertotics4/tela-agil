import React, { createContext, useCallback, useContext } from 'react';

import eqtlBarApi from '../services/eqtlBarApi';

import Installation from '../types/Installation';
import ServiceNotes, { OpenNote } from '../types/ServiceNotes';

interface PowerReconnectionContextData {
  ableToReconnection({
    contractAccount,
    installation,
    operatingCompany,
    protocol,
    serviceNotes,
  }: AbleToReconnectionProps): Promise<AbleToReconnectionResponse>;
  suitableForEmergencyReconnection(): boolean;
}

interface AbleToReconnectionResponse {
  ok: boolean;
  error: string;
}

interface AbleToReconnectionProps {
  contractAccount: string;
  installation: Installation;
  operatingCompany: string;
  protocol: string;
  serviceNotes: ServiceNotes;
}

const PowerReconnectionServiceContext = createContext<PowerReconnectionContextData>(
  {} as PowerReconnectionContextData,
);

const PowerReconnectionProvider: React.FC = ({ children }) => {
  const ableToReconnection = useCallback(
    async ({
      contractAccount,
      installation,
      operatingCompany,
      protocol,
      serviceNotes,
    }: AbleToReconnectionProps) => {
      const answeringPhone = '116';

      // Buscar notas de desligamento
      const shutdownNote = serviceNotes.openServiceNotes.find(
        note =>
          note.type === 'DS' &&
          (note.status === 'RECE' || note.status === 'ABER'),
      );

      // Buscar notas de suspensão
      const suspensionNote = serviceNotes.openServiceNotes.find(
        note =>
          note.type === 'SF' &&
          (note.status === 'RECE' || note.status === 'ABER'),
      );

      // Buscar notas de fiscalização
      const oversightNote = serviceNotes.openServiceNotes.find(
        note =>
          note.type === 'FS' &&
          (note.status === 'RECE' || note.status === 'ABER'),
      );

      // Buscar notas de ligação nova
      const newEnergyConnectionNote = serviceNotes.openServiceNotes.find(
        note =>
          note.type === 'LN' &&
          (note.status === 'RECE' || note.status === 'ABER'),
      );

      // Buscar notas de religação
      const reconnectionNote = serviceNotes.openServiceNotes.find(
        note => note.type === 'RL',
      );

      if (installation.status === 'Potencial') {
        return {
          ok: false,
          error: `A conta contrato ${contractAccount} não está ligada.`,
        };
      }

      if (
        installation.status === 'Desligada' ||
        installation.status === 'Desliga em andamento'
      ) {
        return {
          ok: false,
          error:
            'Esta conta contrato está desligada. Para restabelecer seu fornecimento de energia você precisa solicitar uma reativação.',
        };
      }

      if (
        installation.cutInProgress ||
        installation.status === 'Corte executado' ||
        installation.status === 'Corte em andamento'
      ) {
        if (reconnectionNote) {
          if (
            reconnectionNote.status === 'REJE' ||
            reconnectionNote.status === 'ATIV' ||
            reconnectionNote.status === 'DEVO'
          ) {
            return {
              ok: false,
              error: 'Já existe uma nota de Religação aberta.',
            };
          }

          if (reconnectionNote.status === 'RECE') {
            if (reconnectionNote.code === 'RELU') {
              return {
                ok: false,
                error: `Já existe um serviço de religação de urgência em aberto para ${contractAccount}. Por favor, aguarde e logo logo seu fornecimento de energia será restabelecido.`,
              };
            }

            if (reconnectionNote.code === 'RELA') {
              return {
                ok: false,
                error: `Já existe um serviço de religação automática em aberto para ${contractAccount}. Por favor, aguarde e logo logo seu fornecimento de energia será restabelecido.`,
              };
            }

            if (reconnectionNote.code === 'RELC') {
              return {
                ok: false,
                error: `Já existe um serviço de religação em aberto para ${contractAccount}. Por favor, aguarde e logo logo seu fornecimento de energia será restabelecido.`,
              };
            }
          }
        }
      }
    },
    [],
  );

  const suitableForEmergencyReconnection = useCallback(() => {
    return false; // HARD CODDED
  }, []);

  return (
    <PowerReconnectionServiceContext.Provider
      value={{ ableToReconnection, suitableForEmergencyReconnection }}
    >
      {children}
    </PowerReconnectionServiceContext.Provider>
  );
};

function usePowerReconnectionService(): PowerReconnectionContextData {
  const context = useContext(PowerReconnectionServiceContext);

  if (!context) {
    throw new Error(
      'usePowerReconnectionService must be used within a PowerReconnectionProvider',
    );
  }

  return context;
}

export { PowerReconnectionProvider, usePowerReconnectionService };
