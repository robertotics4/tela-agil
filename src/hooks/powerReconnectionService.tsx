import React, { createContext, useCallback, useContext } from 'react';
import { v4 as uuid } from 'uuid';

import eqtlBarApi from '../services/eqtlBarApi';

import Installation from '../types/Installation';
import ServiceNotes from '../types/ServiceNotes';

interface PowerReconnectionContextData {
  ableToReconnection({
    contractAccount,
    installation,
    serviceNotes,
  }: AbleToReconnectionProps): AbleToReconnectionResponse;
  getReconnectionInfo({
    installationNumber,
    phaseNumber,
    locality,
    operatingCompany,
  }: GetReconnectionInfoProps): Promise<ReconnectionInfo>;
}

interface AbleToReconnectionResponse {
  ok: boolean;
  error?: string;
}

interface ReconnectionInfo {
  tariffs: {
    commonTariff?: number;
    emergencyTariff?: number;
  };
  deadlineForReconnection: { hours: number };
}

interface AbleForEmergencyReconnectionProps {
  operatingCompany: string;
  installationNumber: string;
}

interface AbleToReconnectionProps {
  contractAccount: string;
  installation: Installation;
  serviceNotes: ServiceNotes;
}

interface GetReconnectionInfoProps {
  installationNumber: string;
  phaseNumber: number;
  locality: string;
  operatingCompany: string;
}

const PowerReconnectionServiceContext = createContext<PowerReconnectionContextData>(
  {} as PowerReconnectionContextData,
);

const PowerReconnectionProvider: React.FC = ({ children }) => {
  const ableForEmergencyReconnection = useCallback(
    async ({
      operatingCompany,
      installationNumber,
    }: AbleForEmergencyReconnectionProps) => {
      const response = await eqtlBarApi.get(
        '/servico/v1/religa/validaHorario',
        {
          params: {
            empresaOperadora: operatingCompany,
            numeroInstalacao: installationNumber,
            codigoTransacao: uuid(),
          },
        },
      );

      if (response.data.data.regraSaida === 'U') {
        return true;
      }

      return false;
    },
    [],
  );

  const getReconnectionInfo = useCallback(
    async ({
      installationNumber,
      phaseNumber,
      locality,
      operatingCompany,
    }: GetReconnectionInfoProps) => {
      const hasEmergencyReconnection = await ableForEmergencyReconnection({
        installationNumber,
        operatingCompany,
      });

      const reconnectionInfo = {} as ReconnectionInfo;

      if (hasEmergencyReconnection) {
        if (phaseNumber === 1) {
          switch (operatingCompany) {
            case '98':
              reconnectionInfo.tariffs = { commonTariff: 8.23 };
              break;
            case '95':
              reconnectionInfo.tariffs = {
                commonTariff: 8.24,
                emergencyTariff: 41.31,
              };
              break;
            case '82':
              reconnectionInfo.tariffs = { commonTariff: 8.25 };
              break;
            case '86':
              reconnectionInfo.tariffs = { commonTariff: 7.88 };
              break;
            default:
              break;
          }
        }

        if (phaseNumber === 2) {
          switch (operatingCompany) {
            case '98':
              reconnectionInfo.tariffs = { commonTariff: 11.34 };
              break;
            case '95':
              reconnectionInfo.tariffs = {
                commonTariff: 11.34,
                emergencyTariff: 61.98,
              };
              break;
            case '82':
              reconnectionInfo.tariffs = { commonTariff: 34.12 };
              break;
            case '86':
              reconnectionInfo.tariffs = { commonTariff: 32.6 };
              break;
            default:
              break;
          }
        }

        if (phaseNumber === 3) {
          switch (operatingCompany) {
            case '98':
              reconnectionInfo.tariffs = { commonTariff: 34.06 };
              break;
            case '95':
              reconnectionInfo.tariffs = {
                commonTariff: 34.07,
                emergencyTariff: 103.32,
              };
              break;
            default:
              break;
          }
        }
      }

      if (!hasEmergencyReconnection) {
        if (locality === 'RURAL') {
          reconnectionInfo.deadlineForReconnection = { hours: 48 };
        } else {
          reconnectionInfo.deadlineForReconnection = { hours: 24 };
        }

        if (phaseNumber === 1) {
          switch (operatingCompany) {
            case '98':
              reconnectionInfo.tariffs = { commonTariff: 8.23 };
              break;
            case '95':
              reconnectionInfo.tariffs = { commonTariff: 8.24 };
              break;
            case '82':
              reconnectionInfo.tariffs = { commonTariff: 8.25 };
              break;
            case '86':
              reconnectionInfo.tariffs = { commonTariff: 7.88 };
              break;
            default:
              break;
          }
        }

        if (phaseNumber === 2) {
          switch (operatingCompany) {
            case '98':
              reconnectionInfo.tariffs = { commonTariff: 11.34 };
              break;
            case '95':
              reconnectionInfo.tariffs = { commonTariff: 11.34 };
              break;
            default:
              break;
          }
        }

        if (phaseNumber === 3) {
          switch (operatingCompany) {
            case '98':
              reconnectionInfo.tariffs = { commonTariff: 34.06 };
              break;
            case '95':
              reconnectionInfo.tariffs = { commonTariff: 34.07 };
              break;
            case '82':
              reconnectionInfo.tariffs = { commonTariff: 34.12 };
              break;
            case '86':
              reconnectionInfo.tariffs = { commonTariff: 32.6 };
              break;
            default:
              break;
          }
        }
      }

      return reconnectionInfo;
    },
    [ableForEmergencyReconnection],
  );

  const ableToReconnection = useCallback(
    ({
      contractAccount,
      installation,
      serviceNotes,
    }: AbleToReconnectionProps) => {
      // Buscar notas de desligamento
      const shutdownNote = serviceNotes.openServiceNotes.find(
        note => note.type === 'DS',
      );

      // Buscar notas de suspensão
      const suspensionNote = serviceNotes.openServiceNotes.find(
        note => note.type === 'SF',
      );

      // Buscar notas de fiscalização
      const oversightNote = serviceNotes.openServiceNotes.find(
        note => note.type === 'FS',
      );

      // Buscar notas de ligação nova
      const newEnergyConnectionNote = serviceNotes.openServiceNotes.find(
        note => note.type === 'LN',
      );

      // Buscar notas de religação
      const reconnectionNote = serviceNotes.openServiceNotes.find(
        note => note.type === 'RL',
      );

      console.log(reconnectionNote);
      console.log(shutdownNote);
      console.log(oversightNote);
      console.log(suspensionNote);
      console.log(newEnergyConnectionNote);

      if (installation.status === 'Potencial') {
        return {
          ok: false,
          error: `A conta contrato ${contractAccount} ainda não está ligada.`,
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
        console.log('corteExecutado');

        if (reconnectionNote) {
          if (
            reconnectionNote.status === 'REJE' ||
            reconnectionNote.status === 'ATIV' ||
            reconnectionNote.status === 'DEVO'
          ) {
            return {
              // VERIFICAR TEXTO
              ok: false,
              error: 'Infelizmente não é possível atender este caso por aqui.',
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

        if (shutdownNote) {
          return {
            ok: false,
            error:
              'Esta conta contrato está desligada. Para restabelecer seu fornecimento de energia você precisa solicitar uma reativação.',
          };
        }

        if (oversightNote) {
          // VERIFICAR ESSA CONDIÇÃO
          return {
            ok: false,
            error:
              'Infelizmente não é possível atender este caso por aqui. Você pode solicitar este serviço ligando para o 116 ou indo em uma de nossas agências de atendimento',
          };
        }

        if (suspensionNote) {
          // VERIFICAR ESSA CONDIÇÃO
          if (
            suspensionNote.status !== 'RECE' &&
            suspensionNote.status !== 'FINL'
          ) {
            if (oversightNote) {
              return {
                ok: false,
                error:
                  'Infelizmente não é possível atender este caso por aqui. Você pode solicitar este serviço ligando para o 116 ou indo em uma de nossas agências de atendimento',
              };
            }
          }
        }
      }

      if (newEnergyConnectionNote) {
        return {
          ok: false,
          error: `Já existe um serviço de reativação em aberto para ${contractAccount}. Por favor, aguarde e logo logo seu fornecimento de energia será restabelecido.`,
        };
      }

      if (
        installation.status === 'Reativa em Andamento' ||
        installation.status === 'Religa em Andamento'
      ) {
        console.log('religa andamento');

        if (newEnergyConnectionNote) {
          return {
            ok: false,
            error: `Já existe um serviço de reativação em aberto para ${contractAccount}. Por favor, aguarde e logo logo seu fornecimento de energia será restabelecido.`,
          };
        }

        if (reconnectionNote) {
          if (
            reconnectionNote.status === 'REJE' ||
            reconnectionNote.status === 'ATIV' ||
            reconnectionNote.status === 'DEVO'
          ) {
            // VERIFICAR ESSE TEXTO
            return {
              ok: false,
              error: 'Infelizmente não é possível atender este caso por aqui.',
            };
          }

          if (
            reconnectionNote.status === 'RECE' ||
            reconnectionNote.status === 'ERRO'
          ) {
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

        if (reconnectionNote) {
          if (
            reconnectionNote.status === 'REJE' ||
            reconnectionNote.status === 'ATIV' ||
            reconnectionNote.status === 'DEVO'
          ) {
            // VERIFICAR ESSE TEXTO
            return {
              ok: false,
              error: 'Infelizmente não é possível atender este caso por aqui.',
            };
          }

          return {
            ok: false,
            error: 'Você já possui uma religação em andamento',
          };
        }
      }

      if (installation.status === 'Ligada') {
        if (oversightNote) {
          // VERIFICAR ESSE
          return {
            ok: false,
            error: 'Infelizmente não é possível atender este caso por aqui.',
          };
        }

        if (suspensionNote) {
          return { ok: true };
        }

        return {
          ok: false,
          error: `A conta contrato ${contractAccount} não está com o fornecimento suspenso, mas pode ser que você esteja com uma falta de energia.`,
        };
      }

      // AVALIAR ESTE CASO
      return { ok: true };
    },
    [],
  );

  return (
    <PowerReconnectionServiceContext.Provider
      value={{ ableToReconnection, getReconnectionInfo }}
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
