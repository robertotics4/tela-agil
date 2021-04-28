import React, { createContext, useCallback, useContext } from 'react';
import { useLoading } from 'react-use-loading';
import { v4 as uuid } from 'uuid';
import Swal from 'sweetalert2';

import eqtlBarApi from '../services/eqtlBarApi';

import Customer from '../types/Customer';
import Installation from '../types/Installation';
import ServiceNotes from '../types/ServiceNotes';

import Loading from '../components/Loading';
import Debits from '../types/Debits';

import { currencyMask } from '../utils/inputMasks';
import { useAuth } from './auth';
import { useCustomerService } from './customerService';

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
  prepareForPowerReconnection({
    attendanceData,
    installation,
    debits,
    operatingCompany,
    protocol,
  }: PrepareForPowerReconnectionProps): Promise<void>;
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

interface GeneratePowerReconnectionProps {
  type: 'common' | 'emergency';
  operatingCompany: string;
  contractAccount: string;
  protocol: string;
  descriptionText: string;
  reference: string;
}

interface StartPowerReconnectionFlowProps {
  attendanceData: Customer;
  installation: Installation;
  operatingCompany: string;
  protocol: string;
}

interface PrepareForPowerReconnectionProps {
  attendanceData: Customer;
  installation: Installation;
  debits: Debits;
  operatingCompany: string;
  protocol: string;
}

const PowerReconnectionServiceContext = createContext<PowerReconnectionContextData>(
  {} as PowerReconnectionContextData,
);

const PowerReconnectionProvider: React.FC = ({ children }) => {
  const [
    { isLoading, message },
    { start: startLoading, stop: stopLoading },
  ] = useLoading();

  const { user } = useAuth();
  const { fetchInstallationData } = useCustomerService();

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

  const generatePowerReconnection = useCallback(
    async ({
      type,
      operatingCompany,
      contractAccount,
      protocol,
      descriptionText,
      reference,
    }: GeneratePowerReconnectionProps) => {
      try {
        startLoading('Gerando solicitação de Religação ...');

        let path;

        switch (type) {
          case 'common':
            path = '/servico/v1/religa/comum';
            break;
          case 'emergency':
            path = '/servico/v1/religa/urgente';
            break;
          default:
            return;
        }

        await eqtlBarApi.post(
          path,
          {
            codigoTransacao: uuid(),
            data: {
              contaContrato: contractAccount,
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

        await fetchInstallationData({
          contractAccount,
          operatingCompany,
        });

        Swal.fire({
          icon: 'success',
          title: 'Religação',
          html: '<p>Religação comum gerada com sucesso.</p>',
          confirmButtonText: `OK`,
          confirmButtonColor: '#3c1490',
        });
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Religação',
          html: '<p>Falha ao gerar a solicitação de Religação.</p>',
          confirmButtonText: `OK`,
          confirmButtonColor: '#3c1490',
        });
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading, fetchInstallationData],
  );

  const startPowerReconnectionFlow = useCallback(
    async ({
      attendanceData,
      installation,
      operatingCompany,
      protocol,
    }: StartPowerReconnectionFlowProps) => {
      try {
        startLoading('Analisando informações da instalação ...');

        const reconnectionInfo = await getReconnectionInfo({
          installationNumber: attendanceData.installationNumber,
          locality: installation.technicalData.locality,
          operatingCompany,
          phaseNumber: attendanceData.phaseNumber,
        });

        if (
          !reconnectionInfo.tariffs.emergencyTariff &&
          reconnectionInfo.tariffs.commonTariff
        ) {
          Swal.fire({
            icon: 'question',
            title: 'Religação',
            html: `<p>Você gostaria de solicitar uma Religação Comum com prazo de até ${
              reconnectionInfo.deadlineForReconnection.hours
            } horas para atendimento no valor de ${currencyMask(
              reconnectionInfo.tariffs.commonTariff,
            )} a serem cobrados em sua próxima fatura?</p>`,
            showDenyButton: true,
            confirmButtonText: `Sim, gostaria`,
            denyButtonText: `Não`,
            confirmButtonColor: '#3c1490',
            denyButtonColor: '#eb5757',
          }).then(async resultCommonTariff => {
            if (resultCommonTariff.isConfirmed) {
              await generatePowerReconnection({
                type: 'common',
                contractAccount: attendanceData.contractAccount,
                descriptionText: `Gerado pela Tela Ágil - Usuário: ${user}`,
                operatingCompany,
                protocol: protocol || '00',
                reference: attendanceData.address.referencePoint
                  ? attendanceData.address.referencePoint
                  : '',
              });
            } else if (resultCommonTariff.isDenied) {
              Swal.fire({
                icon: 'info',
                title: 'Religação',
                html: '<p>Sua solicitação não foi realizada.</p>',
                confirmButtonText: `Sim`,
                confirmButtonColor: '#3c1490',
              });
            }
          });
        } else if (
          reconnectionInfo.tariffs.emergencyTariff &&
          reconnectionInfo.tariffs.commonTariff
        ) {
          const inputOptions = {
            COMUM: `Comum = ${currencyMask(
              reconnectionInfo.tariffs.commonTariff || 0,
            )}`,
            URGENCIA: `Urgência = ${currencyMask(
              reconnectionInfo.tariffs.emergencyTariff || 0,
            )}`,
          };

          const { value: reconnectionOption } = await Swal.fire({
            title: 'Religação',
            html:
              '<p>Você gostaria de solicitar uma Religação que será cobrada somente na sua próxima fatura? Caso seja sim, selecione o tipo de religação:</p>',
            input: 'radio',
            inputOptions,
            inputValidator: value => {
              if (!value) {
                return 'Selecione uma opção para continuar.';
              }

              return null;
            },
          });

          if (reconnectionOption) {
            const reconnectionType =
              reconnectionOption === 'URGENCIA' ? 'emergency' : 'common';

            await generatePowerReconnection({
              type: reconnectionType,
              contractAccount: attendanceData.contractAccount,
              descriptionText: `Gerado pela Tela Ágil - Usuário: ${user}`,
              operatingCompany,
              protocol: protocol || '00',
              reference: attendanceData.address.referencePoint
                ? attendanceData.address.referencePoint
                : '',
            });
          }
        }
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Religação',
          html: '<p>Falha ao gerar o serviço de religação.</p>',
          confirmButtonText: `OK`,
          confirmButtonColor: '#3c1490',
        });
      } finally {
        stopLoading();
      }
    },
    [
      generatePowerReconnection,
      getReconnectionInfo,
      startLoading,
      stopLoading,
      user,
    ],
  );

  const prepareForPowerReconnection = useCallback(
    async ({
      attendanceData,
      installation,
      debits,
      operatingCompany,
      protocol,
    }: PrepareForPowerReconnectionProps) => {
      if (
        debits.invoiceDebits.totalAmountInvoiceDebits > 0 ||
        debits.installmentDebits.totalAmountInstallmentDebits > 0
      ) {
        Swal.fire({
          icon: 'question',
          title: 'Religação',
          html: `<p>Você possui ${
            debits.invoiceDebits.invoiceDebitDetails.length
          } faturas com um débito de ${currencyMask(
            debits.invoiceDebits.totalAmountInvoiceDebits,
          )}. Estão pagas?</p>`,
          showDenyButton: true,
          confirmButtonText: `Sim`,
          denyButtonText: `Não`,
          confirmButtonColor: '#3c1490',
          denyButtonColor: '#eb5757',
        }).then(async resultHasDebits => {
          if (resultHasDebits.isConfirmed) {
            await startPowerReconnectionFlow({
              attendanceData,
              installation,
              operatingCompany,
              protocol,
            });
          } else if (resultHasDebits.isDenied) {
            Swal.fire({
              icon: 'info',
              title: 'Religação',
              html:
                '<p>Efetue o pagamento e retorne para solicitar a religação.</p>',
              confirmButtonText: `Sim`,
              confirmButtonColor: '#3c1490',
            });
          }
        });
      } else {
        await startPowerReconnectionFlow({
          attendanceData,
          installation,
          operatingCompany,
          protocol,
        });
      }
    },
    [startPowerReconnectionFlow],
  );

  return (
    <PowerReconnectionServiceContext.Provider
      value={{
        ableToReconnection,
        getReconnectionInfo,
        prepareForPowerReconnection,
      }}
    >
      {children}

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stopLoading} />
      )}
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
