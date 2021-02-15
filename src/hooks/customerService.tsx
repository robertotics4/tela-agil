import React, { createContext, useCallback, useContext, useState } from 'react';
import customerDataApi from '../services/customerDataApi';

import { useToast } from './toast';

import Customer from '../types/Customer';

import extractResponseData from '../utils/extractResponseData';
import Installation from '../types/Installation';

interface CustomerServiceState {
  customer: Customer;
  installation: Installation;
}

interface GetCustomerData {
  stateCode: string;
  contract?: string;
  cpf?: string;
}

interface CustomerServiceContextData {
  customer: Customer;
  installation: Installation;
  serviceStarted: boolean;
  getCustomer(customerData: GetCustomerData): Promise<void>;
  startService({ stateCode, contract, cpf }: GetCustomerData): Promise<void>;
  finishService(): void;
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
      const { customer, installation } = JSON.parse(
        storagedCustomerServiceData,
      );
      return { customer, installation };
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

      const response = await customerDataApi.get(url);

      const { customer, installation } = extractResponseData(
        response,
        stateCode,
      );

      localStorage.setItem(
        '@TelaAgil:customerServiceData',
        JSON.stringify({ customer, installation }),
      );

      setCustomerServiceData({ customer, installation });
    },
    [],
  );

  const startService = useCallback(
    async ({ stateCode, contract, cpf }: GetCustomerData) => {
      try {
        await getCustomer({
          stateCode,
          contract,
          cpf,
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
    [getCustomer, addToast],
  );

  const finishService = useCallback(() => {
    localStorage.removeItem('@TelaAgil:customerServiceData');

    setCustomerServiceData({} as CustomerServiceContextData);

    setServiceStarted(false);
  }, []);

  return (
    <CustomerServiceContext.Provider
      value={{
        customer: customerServiceData.customer,
        installation: customerServiceData.installation,
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
