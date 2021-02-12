import React, { createContext, useCallback, useContext, useState } from 'react';
import customerDataApi from '../services/customerDataApi';

import Customer from '../types/Customer';

import extractResponseData from '../utils/extractResponseData';

interface CustomerServiceState {
  customer: Customer;
}

interface GetCustomerData {
  stateCode: string;
  contract?: string;
  cpf?: string;
}

interface CustomerServiceContextData {
  customer: Customer;
  getCustomer(customerData: GetCustomerData): Promise<void>;
  finishService(): void;
}

const CustomerServiceContext = createContext<CustomerServiceContextData>(
  {} as CustomerServiceContextData,
);

const CustomerServiceProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<CustomerServiceState>(() => {
    const customer = localStorage.getItem('@TelaAgil:customer');

    let mergedData;

    if (customer) {
      mergedData = { customer: JSON.parse(customer) };

      return mergedData;
    }

    return {} as CustomerServiceState;
  });

  const getCustomer = useCallback(
    async ({ stateCode, contract, cpf }: GetCustomerData) => {
      let url;

      if (cpf) {
        url = `/atendimento/v1/clientes?cpf=${cpf}&flagDadosCliente=true&flagStatusInstalacao=true&flagPossuiDebitos=true&flagDadosTecnicos=true&empresaOperadora=${stateCode}&flagNotasAbertas=true&flagNotasEncerradas=true&flagDetalheDebitoCobranca=true&flagDetalheDebitoFatura=true&codigoTransacao=123`;
      } else {
        url = `/atendimento/v1/clientes?contrato=${contract}&flagDadosCliente=true&flagStatusInstalacao=true&flagPossuiDebitos=true&flagDadosTecnicos=true&empresaOperadora=${stateCode}&flagNotasAbertas=true&flagNotasEncerradas=true&flagDetalheDebitoCobranca=true&flagDetalheDebitoFatura=true&codigoTransacao=123`;
      }

      const response = await customerDataApi.get(url);

      const { customer } = extractResponseData(response);

      localStorage.setItem('@TelaAgil:customer', JSON.stringify(customer));
    },
    [],
  );

  const finishService = useCallback(() => {
    localStorage.removeItem('@TelaAgil:customer');
    setData({} as CustomerServiceContextData);
  }, []);

  return (
    <CustomerServiceContext.Provider
      value={{
        customer: data.customer,
        getCustomer,
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
