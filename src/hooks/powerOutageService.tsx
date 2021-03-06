import React, { createContext, useCallback, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { useLoading } from 'react-use-loading';
import Swal from 'sweetalert2';

import eqtlBarApi from '../services/eqtlBarApi';

import Loading from '../components/Loading';

import { useAuth } from './auth';

import Installation from '../types/Installation';
import ServiceNotes from '../types/ServiceNotes';
import { useCustomerService } from './customerService';

interface PowerOutageServiceContextData {
  ableToPowerOutage({
    contractAccount,
    installation,
    operatingCompany,
    protocol,
    reference,
    serviceNotes,
  }: AbleToPowerOutageProps): Promise<boolean>;
  generatePowerOutageService({
    type,
    descriptionText,
    reference,
    protocol,
    operatingCompany,
    contractAccount,
  }: GeneratePowerOutageProps): Promise<string | null>;
}

interface GeneratePowerOutageProps {
  type: 'complete' | 'power surge' | 'lack of phase' | 'information note';
  descriptionText: string;
  reference: string;
  protocol: string;
  operatingCompany: string;
  contractAccount: string;
}

interface AbleToPowerOutageProps {
  contractAccount: string;
  installation: Installation;
  operatingCompany: string;
  protocol: string;
  reference: string;
  serviceNotes: ServiceNotes;
}

const PowerOutageServiceContext = createContext<PowerOutageServiceContextData>(
  {} as PowerOutageServiceContextData,
);

const PowerOutageServiceProvider: React.FC = ({ children }) => {
  const [
    { isLoading, message },
    { start: startLoading, stop: stopLoading },
  ] = useLoading();

  const { user } = useAuth();
  const { fetchInstallationData } = useCustomerService();

  const generatePowerOutageService = useCallback(
    async ({
      type,
      descriptionText,
      reference,
      protocol,
      operatingCompany,
      contractAccount,
    }: GeneratePowerOutageProps): Promise<string | null> => {
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
        case 'information note':
          path = '/servico/v1/faltaenergia/notaInformativa';
          break;
        default:
          throw new Error('Falta de energia com tipo inválido');
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

      await fetchInstallationData({
        contractAccount,
        operatingCompany,
      });

      const { codigoSR } = response.data.data;

      return codigoSR;
    },
    [fetchInstallationData],
  );

  const ableToPowerOutage = useCallback(
    async ({
      contractAccount,
      installation,
      operatingCompany,
      protocol,
      reference,
      serviceNotes,
    }: AbleToPowerOutageProps) => {
      const reconnectionNotes = serviceNotes.openServiceNotes.some(
        note => note.type === 'RL',
      );

      const suspensionNotes = serviceNotes.openServiceNotes.some(
        note => note.type === 'SF',
      );

      const newEnergyConnectionNotes = serviceNotes.openServiceNotes.some(
        note => note.type === 'LN',
      );

      const hasPowerCut = !!(
        installation.cutInProgress ||
        installation.status === 'Corte em Andamento' ||
        installation.status === 'Corte executado' ||
        installation.status === 'Cortada'
      );

      const hasActiveSuspension = !!(
        suspensionNotes ||
        installation.cutInProgress ||
        installation.status === 'Corte em Andamento' ||
        installation.status === 'Corte executado'
      );

      const CCIsDisconnected = !!(
        installation.status === 'Desligada' ||
        installation.status === 'Desligada em Andamento' ||
        installation.status === 'Desliga em Andamento' ||
        installation.status === 'Desliga em andamento'
      );

      const hasPowerReconnection = !!(
        reconnectionNotes || installation.status === 'Religa em Andamento'
      );

      const hasPowerReactivation = !!(
        installation.status === 'Reativação em Andamento' ||
        installation.status === 'Reativa em Andamento'
      );

      if (
        hasPowerReconnection ||
        hasActiveSuspension ||
        hasPowerCut ||
        CCIsDisconnected ||
        hasPowerReactivation ||
        installation.scheduledShutdown ||
        installation.powerPhaseOutage ||
        installation.powerOutageTechnicalEvaluation ||
        installation.individualPowerOutage ||
        installation.collectivePowerOutage ||
        installation.turnOffInProgress ||
        newEnergyConnectionNotes
      ) {
        try {
          startLoading('Analisando dados do cliente ...');

          let serviceName = '';
          let alertDescription = '';

          if (hasPowerReconnection) {
            alertDescription = 'O cliente possui uma RELIGAÇÃO em andamento';
          }

          if (hasActiveSuspension) {
            alertDescription = 'O cliente possui uma SUSPENSÃO em andamento';
          }

          if (newEnergyConnectionNotes) {
            alertDescription = 'O cliente possui uma LIGAÇÃO NOVA em andamento';
          }

          if (installation.cutInProgress || hasPowerCut) {
            serviceName = 'Corte em andamento';
            alertDescription =
              'Verifiquei que seu fornecimento de energia está suspenso. Para restabelecer sua energia, preciso que você efetue o pagamento e solicite uma religação.';
          }

          if (installation.status === 'Religa em Andamento') {
            serviceName = 'Religa em Andamento';
            alertDescription =
              'Verifiquei que você possui uma solicitação de religação em aberto e por isso não é possível solicitar uma falta de energia. Nosso Centro de Operações já foi informado e você será atendido em breve.';
          }

          if (installation.status === 'Desligada') {
            serviceName = 'Conta desligada';
            alertDescription = `Verifiquei que ${contractAccount} está desligada. Para restabelecer sua energia, preciso que você solicite uma reativação.`;
          }

          if (installation.status === 'Corte executado') {
            serviceName = 'Corte executado';
            alertDescription = `Verifiquei que seu fornecimento de energia está suspenso. Para restabelecer sua energia, preciso que você efetue o pagamento e solicite uma religação.`;
          }

          if (installation.turnOffInProgress) {
            serviceName = 'Desliga em Andamento';
            alertDescription = `Verifiquei que ${contractAccount} está desligada. Para restabelecer sua energia, preciso que você solicite uma reativação.`;
          }

          if (installation.scheduledShutdown) {
            serviceName = 'Desliga Programado';
            alertDescription = `Verifiquei que atual ${contractAccount} está em uma área de desligamento programado. Nossa equipe está trabalhando na rede elétrica que atende seu imóvel. Em breve seu fornecimento será restabelecido.`;
          }

          if (installation.powerPhaseOutage) {
            serviceName = 'Falta fases';
            alertDescription =
              'Verifiquei que você já possui uma solicitação de falta de fase em aberto. Já estamos trabalhando e em breve você será atendido.';
          }

          if (installation.powerOutageTechnicalEvaluation) {
            serviceName = 'Oscilacao';
            alertDescription =
              'Já abri a sua solicitação de falta energia e nossa equipe já está trabalhando para lhe atender.';
          }

          if (installation.individualPowerOutage) {
            serviceName = 'Falta de Energia Individual';
            alertDescription =
              'Já abri a sua solicitação de falta energia e nossa equipe já está trabalhando para lhe atender.';
          }

          if (installation.collectivePowerOutage) {
            serviceName = 'Falta Energia Coletiva';
            alertDescription =
              'Um dos seus vizinhos já informou sobre essa falta de energia. Fique tranquilo, nossa equipe já está trabalhando para te atender, ok?';
          }

          const codigoSR = await generatePowerOutageService({
            type: 'information note',
            descriptionText: `${serviceName} - Gerado pela Tela Ágil - Usuário: ${user}`,
            reference,
            contractAccount,
            operatingCompany,
            protocol,
          });

          Swal.fire({
            icon: 'warning',
            title: 'Nota informativa',
            html: codigoSR
              ? `<p>${alertDescription}<br><br>Código do serviço gerado: <b>${codigoSR}</b></p>`
              : `<p> ${alertDescription}</p>`,
            confirmButtonText: `OK`,
            confirmButtonColor: '#3c1490',
          });
        } catch {
          Swal.fire({
            icon: 'error',
            title: 'Falta de energia',
            html:
              '<p>Ocorreu um erro ao tentar gerar um serviço de Falta de Energia.',
            confirmButtonText: `OK`,
            confirmButtonColor: '#3c1490',
          });
        } finally {
          stopLoading();
        }

        return false;
      }

      return true;
    },
    [generatePowerOutageService, user, startLoading, stopLoading],
  );

  return (
    <PowerOutageServiceContext.Provider
      value={{
        ableToPowerOutage,
        generatePowerOutageService,
      }}
    >
      {children}

      {isLoading && (
        <Loading isOpen={isLoading} message={message} setIsOpen={stopLoading} />
      )}
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
