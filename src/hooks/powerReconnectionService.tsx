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

      // Buscar notas de suspens??o
      const suspensionNote = serviceNotes.openServiceNotes.find(
        note => note.type === 'SF',
      );

      // Buscar notas de fiscaliza????o
      const oversightNote = serviceNotes.openServiceNotes.find(
        note => note.type === 'FS',
      );

      // Buscar notas de liga????o nova
      const newEnergyConnectionNote = serviceNotes.openServiceNotes.find(
        note => note.type === 'LN',
      );

      // Buscar notas de religa????o
      const reconnectionNote = serviceNotes.openServiceNotes.find(
        note => note.type === 'RL',
      );

      if (installation.status === 'Potencial') {
        return {
          ok: false,
          error: `A conta contrato ${contractAccount} ainda n??o est?? ligada.`,
        };
      }

      if (
        installation.status === 'Desligada' ||
        installation.status === 'Desliga em andamento'
      ) {
        return {
          ok: false,
          error:
            'Esta conta contrato est?? desligada. Para restabelecer seu fornecimento de energia voc?? precisa solicitar uma reativa????o.',
        };
      }

      if (
        installation.cutInProgress ||
        installation.status === 'Corte executado' ||
        installation.status === 'Corte em andamento' ||
        installation.status === 'Cortada'
      ) {
        if (reconnectionNote) {
          if (
            reconnectionNote.status === 'REJE' ||
            reconnectionNote.status === 'ATIV' ||
            reconnectionNote.status === 'ABER' || // Validar
            reconnectionNote.status === 'DEVO'
          ) {
            return {
              ok: false,
              error: `Infelizmente n??o ?? poss??vel gerar uma religa????o por aqui, pois esse cliente tem uma nota de religa????o com o status ${reconnectionNote.status}`,
            };
          }

          if (
            reconnectionNote.status === 'RECE'
            // reconnectionNote.status === 'CONC' // Validar
          ) {
            if (reconnectionNote.code === 'RELU') {
              return {
                ok: false,
                error: `J?? existe um servi??o de religa????o de urg??ncia em aberto para ${contractAccount}. Por favor, aguarde e logo logo seu fornecimento de energia ser?? restabelecido.`,
              };
            }

            if (reconnectionNote.code === 'RELA') {
              return {
                ok: false,
                error: `J?? existe um servi??o de religa????o autom??tica em aberto para ${contractAccount}. Por favor, aguarde e logo logo seu fornecimento de energia ser?? restabelecido.`,
              };
            }

            if (reconnectionNote.code === 'RELC') {
              return {
                ok: false,
                error: `J?? existe um servi??o de religa????o em aberto para ${contractAccount}. Por favor, aguarde e logo logo seu fornecimento de energia ser?? restabelecido.`,
              };
            }
          }
        }

        if (shutdownNote) {
          return {
            ok: false,
            error:
              'Esta conta contrato est?? desligada. Para restabelecer seu fornecimento de energia voc?? precisa solicitar uma reativa????o',
          };
        }

        if (oversightNote) {
          return {
            ok: false,
            error: `Infelizmente n??o ?? poss??vel atender este caso por aqui, pois esse cliente tem uma nota de fiscaliza????o com status ${oversightNote.status}`,
          };
        }

        if (suspensionNote) {
          if (
            suspensionNote.status !== 'RECE' &&
            // suspensionNote.status !== 'CONC' && // Validar
            suspensionNote.status !== 'FINL'
          ) {
            if (oversightNote) {
              return {
                ok: false,
                error: `Infelizmente n??o ?? poss??vel atender este caso por aqui, pois esse cliente tem uma nota de fiscaliza????o`,
              };
            }
          }
        }
      }

      if (newEnergyConnectionNote) {
        return {
          ok: false,
          error: `J?? existe um servi??o de reativa????o em aberto para ${contractAccount}. Por favor, aguarde e logo logo seu fornecimento de energia ser?? restabelecido`,
        };
      }

      if (
        installation.status === 'Reativa em Andamento' ||
        installation.status === 'Religa em Andamento'
      ) {
        if (newEnergyConnectionNote) {
          return {
            ok: false,
            error: `J?? existe um servi??o de reativa????o em aberto para ${contractAccount}. Por favor, aguarde e logo logo seu fornecimento de energia ser?? restabelecido`,
          };
        }

        if (reconnectionNote) {
          if (
            reconnectionNote.status === 'REJE' ||
            reconnectionNote.status === 'ATIV' ||
            reconnectionNote.status === 'ABER' || // Validar
            reconnectionNote.status === 'DEVO'
          ) {
            return {
              ok: false,
              error: `Infelizmente n??o ?? poss??vel atender este caso por aqui, pois o cliente j?? possui uma nota de religa????o com status ${reconnectionNote.status}`,
            };
          }

          if (
            reconnectionNote.status === 'RECE' ||
            // reconnectionNote.status === 'CONC' || // Validar
            reconnectionNote.status === 'ERRO'
          ) {
            if (reconnectionNote.code === 'RELU') {
              return {
                ok: false,
                error: `J?? existe um servi??o de religa????o de urg??ncia em aberto para ${contractAccount}. Por favor, aguarde e logo logo seu fornecimento de energia ser?? restabelecido.`,
              };
            }

            if (reconnectionNote.code === 'RELA') {
              return {
                ok: false,
                error: `J?? existe um servi??o de religa????o autom??tica em aberto para ${contractAccount}. Por favor, aguarde e logo logo seu fornecimento de energia ser?? restabelecido.`,
              };
            }

            if (reconnectionNote.code === 'RELC') {
              return {
                ok: false,
                error: `J?? existe um servi??o de religa????o em aberto para ${contractAccount}. Por favor, aguarde e logo logo seu fornecimento de energia ser?? restabelecido.`,
              };
            }
          }
        }

        if (reconnectionNote) {
          if (
            reconnectionNote.status === 'REJE' ||
            reconnectionNote.status === 'ATIV' ||
            reconnectionNote.status === 'ABER' || // Validar
            reconnectionNote.status === 'DEVO'
          ) {
            return {
              ok: false,
              error: `Infelizmente n??o ?? poss??vel atender este caso por aqui, pois o cliente j?? possui uma nota de religa????o com status ${reconnectionNote.status}`,
            };
          }

          return {
            ok: false,
            error: 'O cliente j?? possui uma religa????o em andamento',
          };
        }
      }

      if (installation.status === 'Ligada') {
        if (oversightNote) {
          return {
            ok: false,
            error: `Infelizmente n??o ?? poss??vel atender este caso por aqui, pois o cliente possui uma nota de fiscaliza????o com status ${oversightNote.status}`,
          };
        }

        if (suspensionNote) {
          return { ok: true };
        }

        return {
          ok: false,
          error: `A conta contrato ${contractAccount} n??o est?? com o fornecimento suspenso, mas pode ser que voc?? esteja com uma falta de energia.`,
        };
      }

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
        startLoading('Gerando solicita????o de Religa????o ...');

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

        const response = await eqtlBarApi.post(
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

        const { codigoSR } = response.data.data;

        await fetchInstallationData({
          contractAccount,
          operatingCompany,
        });

        Swal.fire({
          icon: 'success',
          title: 'Religa????o',
          html: codigoSR
            ? `<p>Solicita????o gerada com sucesso.<br><br>C??digo do servi??o gerado: <b>${codigoSR}</b></p>`
            : `<p>Solicita????o gerada com sucesso.</p>`,
          confirmButtonText: `OK`,
          confirmButtonColor: '#3c1490',
        });
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Religa????o',
          html: '<p>Falha ao gerar a solicita????o de Religa????o.</p>',
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
        startLoading('Analisando informa????es da instala????o ...');

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
            title: 'Religa????o',
            html: `<p>Voc?? gostaria de solicitar uma Religa????o Comum com prazo de at?? ${
              reconnectionInfo.deadlineForReconnection.hours
            } horas para atendimento no valor de ${currencyMask(
              reconnectionInfo.tariffs.commonTariff,
            )} a serem cobrados em sua pr??xima fatura?</p>`,
            showDenyButton: true,
            confirmButtonText: `Sim, gostaria`,
            denyButtonText: `N??o`,
            confirmButtonColor: '#3c1490',
            denyButtonColor: '#eb5757',
          }).then(async resultCommonTariff => {
            if (resultCommonTariff.isConfirmed) {
              await generatePowerReconnection({
                type: 'common',
                contractAccount: attendanceData.contractAccount,
                descriptionText: `Gerado pela Tela ??gil - Usu??rio: ${user}`,
                operatingCompany,
                protocol: protocol || '00',
                reference: attendanceData.address.referencePoint
                  ? attendanceData.address.referencePoint
                  : '',
              });
            } else if (resultCommonTariff.isDenied) {
              Swal.fire({
                icon: 'info',
                title: 'Religa????o',
                html: '<p>Sua solicita????o n??o foi realizada.</p>',
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
            URGENCIA: `Urg??ncia = ${currencyMask(
              reconnectionInfo.tariffs.emergencyTariff || 0,
            )}`,
          };

          const { value: reconnectionOption } = await Swal.fire({
            title: 'Religa????o',
            html:
              '<p>Voc?? gostaria de solicitar uma Religa????o que ser?? cobrada somente na sua pr??xima fatura? Caso seja sim, selecione o tipo de religa????o:</p>',
            input: 'radio',
            inputOptions,
            inputValidator: value => {
              if (!value) {
                return 'Selecione uma op????o para continuar.';
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
              descriptionText: `Gerado pela Tela ??gil - Usu??rio: ${user}`,
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
          title: 'Religa????o',
          html: '<p>Falha ao gerar o servi??o de religa????o.</p>',
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
          title: 'Religa????o',
          html: `<p>Voc?? possui ${
            debits.invoiceDebits.invoiceDebitDetails.length
          } faturas com um d??bito de ${currencyMask(
            debits.invoiceDebits.totalAmountInvoiceDebits,
          )}. Est??o pagas?</p>`,
          showDenyButton: true,
          confirmButtonText: `Sim`,
          denyButtonText: `N??o`,
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
              title: 'Religa????o',
              html:
                '<p>Efetue o pagamento e retorne para solicitar a religa????o.</p>',
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
