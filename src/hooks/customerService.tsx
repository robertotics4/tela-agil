import React, { createContext, useCallback, useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useToast } from './toast';

import Customer from '../types/Customer';
import Installation from '../types/Installation';
import Debits from '../types/Debits';

import extractResponseData from '../utils/extractResponseData';
import ServiceNotes from '../types/ServiceNotes';
import eqtlBarApi from '../services/eqtlBarApi';

interface CustomerServiceState {
  operatingCompany: string;
  customer: Customer;
  installation: Installation;
  debits: Debits;
  serviceNotes: ServiceNotes;
}

interface GetCustomerData {
  stateCode: string;
  contract?: string;
  cpf?: string;
}

interface StartServiceProps {
  stateCode: string;
  contract: string;
}

interface CustomerServiceContextData {
  operatingCompany: string;
  customer: Customer;
  installation: Installation;
  debits: Debits;
  serviceNotes: ServiceNotes;
  serviceStarted: boolean;
  getCustomer(customerData: GetCustomerData): Promise<void>;
  startService({ stateCode, contract, cpf }: GetCustomerData): Promise<void>;
  finishService(): void;
}

interface GenerateProtocolProps {
  operatingCompany: string;
  contract: string;
}

const CustomerServiceContext = createContext<CustomerServiceContextData>(
  {} as CustomerServiceContextData,
);

const CustomerServiceProvider: React.FC = ({ children }) => {
  const { addToast } = useToast();

  const [serviceStarted, setServiceStarted] = useState(false);

  const [
    customerServiceData,
    setCustomerServiceData,
  ] = useState<CustomerServiceState>(() => {
    const storagedCustomerServiceData = localStorage.getItem(
      '@TelaAgil:customerServiceData',
    );

    if (storagedCustomerServiceData) {
      const {
        operatingCompany,
        customer,
        installation,
        debits,
        serviceNotes,
      } = JSON.parse(storagedCustomerServiceData);

      const customerServiceState: CustomerServiceState = {
        operatingCompany,
        customer,
        installation,
        debits,
        serviceNotes,
      };

      return customerServiceState;
    }

    return {} as CustomerServiceState;
  });

  const getCustomer = useCallback(
    async ({ stateCode, contract, cpf }: GetCustomerData) => {
      let url;

      if (cpf && contract) {
        addToast({
          type: 'error',
          title: 'Erro no formulário',
          description:
            'Utilize apenas um dos campos (Conta contrato ou CPF / CNPJ)',
        });

        return;
      }

      if (cpf) {
        url = `/atendimento/v1/clientes?cpf=${cpf}&flagDadosCliente=true&flagStatusInstalacao=true&flagPossuiDebitos=true&flagDadosTecnicos=false&empresaOperadora=${stateCode}&flagNotasAbertas=true&flagNotasEncerradas=true&flagDetalheDebitoCobranca=true&flagDetalheDebitoFatura=true&codigoTransacao=123`;
      } else {
        url = `/atendimento/v1/clientes?contrato=${contract}&flagDadosCliente=true&flagStatusInstalacao=true&flagPossuiDebitos=true&flagDadosTecnicos=true&empresaOperadora=${stateCode}&flagNotasAbertas=true&flagNotasEncerradas=true&flagDetalheDebitoCobranca=true&flagDetalheDebitoFatura=true&codigoTransacao=123`;
      }

      const response = await eqtlBarApi.get(url);

      const {
        customer,
        installation,
        debits,
        serviceNotes,
      } = extractResponseData(response, stateCode);

      localStorage.setItem(
        '@TelaAgil:customerServiceData',
        JSON.stringify({
          operatingCompany: stateCode,
          customer,
          installation,
          debits,
          serviceNotes,
        }),
      );

      setCustomerServiceData({
        operatingCompany: stateCode,
        customer,
        installation,
        debits,
        serviceNotes,
      });
    },
    [addToast],
  );

  const generateProtocol = useCallback(
    async ({ operatingCompany, contract }: GenerateProtocolProps) => {
      const response = await eqtlBarApi.get('/atendimento/v1/clientes', {
        params: {
          empresaOperadora: operatingCompany,
          contrato: contract,
          flagGerarProtocolo: true,
          codigoTransacao: uuid(),
        },
      });

      localStorage.setItem('@TelaAgil:protocol', response.data.data.protocolo);
    },
    [],
  );

  const startService = useCallback(
    async ({ stateCode, contract }: StartServiceProps) => {
      try {
        await getCustomer({
          stateCode,
          contract,
        });

        await generateProtocol({
          contract,
          operatingCompany: stateCode,
        });

        setServiceStarted(true);
      } catch {
        addToast({
          type: 'error',
          title: 'Erro no atendimento',
          description:
            'Ocorreu um erro ao iniciar o atendimento, cheque as informações do cliente',
        });
      }
    },
    [getCustomer, generateProtocol, addToast],
  );

  const finishService = useCallback(() => {
    localStorage.removeItem('@TelaAgil:protocol');
    localStorage.removeItem('@TelaAgil:customerServiceData');

    setCustomerServiceData({} as CustomerServiceContextData);

    setServiceStarted(false);
  }, []);

  return (
    <CustomerServiceContext.Provider
      value={{
        operatingCompany: customerServiceData.operatingCompany,
        customer: customerServiceData.customer,
        installation: customerServiceData.installation,
        debits: customerServiceData.debits,
        serviceNotes: customerServiceData.serviceNotes,
        serviceStarted,
        getCustomer,
        startService,
        finishService,
      }}
    >
      {children}
    </CustomerServiceContext.Provider>
  );
};

function useCustomerService(): CustomerServiceContextData {
  const context = useContext(CustomerServiceContext);

  if (!context) {
    throw new Error(
      'useCustomerService must be used within a CustomerServiceProvider',
    );
  }

  return context;
}

export { CustomerServiceProvider, useCustomerService };
