import React, { createContext, useCallback, useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { parse } from 'date-fns';

import eqtlBarApi from '../services/eqtlBarApi';

import addZeroesToNumber from '../utils/addZeroesToNumber';

interface MonitoringOfProtocolsContextData {
  protocols: Protocol[];
  getProtocolsList({
    operatingCompany,
    contractAccount,
  }: GetProtocolListProps): Promise<void>;
}

interface GetProtocolListProps {
  operatingCompany: string;
  contractAccount: string;
}

interface ResponseProtocol {
  numero: string;
  servico: string;
  dataSolicitacao: string;
  status: string;
  detalhes: string;
}

interface Protocol {
  number: string;
  service: string;
  requestDate: Date;
  status: 'open' | 'concluded' | 'canceled';
  details: string;
}

const MonitoringOfProtocolsContext = createContext<MonitoringOfProtocolsContextData>(
  {} as MonitoringOfProtocolsContextData,
);

const MonitoringOfProtocolsProvider: React.FC = ({ children }) => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);

  const getProtocolsList = useCallback(
    async ({ operatingCompany, contractAccount }: GetProtocolListProps) => {
      const currentDate = new Date();
      const threeMonthsAgo = currentDate.getMonth() - 2;

      const dateRange = {
        initialDate: `${currentDate.getFullYear()}${addZeroesToNumber(
          threeMonthsAgo.toString(),
          2,
        )}01`,
        endDate: `${currentDate.getFullYear()}${addZeroesToNumber(
          (currentDate.getMonth() + 1).toString(),
          2,
        )}${currentDate.getDate()}`,
      };

      const response = await eqtlBarApi.get(
        '/servico/v1/acompanhamentoServico',
        {
          params: {
            codigoTransacao: uuid(),
            empresaOperadora: operatingCompany,
            contaContrato: contractAccount,
            dataInicio: dateRange.initialDate,
            dataFim: dateRange.endDate,
            canal: 'S',
          },
        },
      );

      if (!response.data.data) {
        throw new Error('Ocorreu um erro ao buscar os protocolos');
      }

      if (response.data.data.codigo !== '000' && response.data.data.mensagem) {
        throw new Error(response.data.data.mensagem);
      }

      if (response.data.data.protocolos) {
        const responseProtocols: Protocol[] = response.data.data.protocolos.map(
          (responseProtocol: ResponseProtocol) => ({
            number: responseProtocol.numero,
            service: responseProtocol.servico,
            requestDate: parse(
              responseProtocol.dataSolicitacao,
              'yyyyMMdd',
              new Date(),
            ),
            status: responseProtocol.status,
            details: responseProtocol.detalhes,
          }),
        );

        setProtocols(responseProtocols);
      }
    },
    [],
  );

  return (
    <MonitoringOfProtocolsContext.Provider
      value={{ protocols, getProtocolsList }}
    >
      {children}
    </MonitoringOfProtocolsContext.Provider>
  );
};

function useMonitoringOfProtocols(): MonitoringOfProtocolsContextData {
  const context = useContext(MonitoringOfProtocolsContext);

  if (!context) {
    throw new Error(
      'useMonitoringOfProtocols must be used within a MonitoringOfProtocolsProvider',
    );
  }

  return context;
}

export { MonitoringOfProtocolsProvider, useMonitoringOfProtocols };
