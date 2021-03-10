import React, { createContext, useCallback, useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useAlert } from './alert';
import { useAuth } from './auth';

import Customer from '../types/Customer';
import Installation from '../types/Installation';
import Debits from '../types/Debits';

import extractResponseData from '../utils/extractResponseData';
import ServiceNotes from '../types/ServiceNotes';
import eqtlBarApi from '../services/eqtlBarApi';
import Address from '../types/Address';

interface CustomerServiceState {
  operatingCompany: string;
  customer: Customer;
  installation: Installation;
  debits: Debits;
  serviceNotes: ServiceNotes;
  protocol?: string;
  contracts: Contract[];
}

interface GetCustomerData {
  stateCode: string;
  contract: string;
}

interface StartServiceProps {
  stateCode: string;
  contract: string;
}

interface CustomerServiceContextData {
  operatingCompany: string;
  protocol: string | undefined;
  customer: Customer;
  installation: Installation;
  debits: Debits;
  serviceNotes: ServiceNotes;
  contracts: Contract[];
  serviceStarted: boolean;
  getCustomer(customerData: GetCustomerData): Promise<void>;
  startService({ stateCode, contract }: GetCustomerData): Promise<void>;
  finishService(attendanceTime: string): Promise<void>;
  registerServicePerformed({
    serviceName,
    executionDate,
  }: ServicePerformed): void;
  findAllContracts({ stateCode, cpf }: FindAllContractsProps): Promise<void>;
}

interface GenerateProtocolProps {
  operatingCompany: string;
  contract: string;
}

interface FindAllContractsProps {
  stateCode: string;
  cpf: string;
}

interface ServicePerformed {
  serviceName: string;
  executionDate: Date;
}

interface Contract {
  owner: string;
  contractAccount: string;
  address: Address;
}

const CustomerServiceContext = createContext<CustomerServiceContextData>(
  {} as CustomerServiceContextData,
);

const CustomerServiceProvider: React.FC = ({ children }) => {
  const { customAlert } = useAlert();
  const { user } = useAuth();

  const [serviceStarted, setServiceStarted] = useState(false);
  const [servicesPerformed, setServicesPerformed] = useState<
    ServicePerformed[]
  >([]);

  const [
    customerServiceData,
    setCustomerServiceData,
  ] = useState<CustomerServiceState>(() => {
    const storagedCustomerServiceData = localStorage.getItem(
      '@TelaAgil:customerServiceData',
    );

    const storagedProtocol = localStorage.getItem('@TelaAgil:protocol');
    const storagedContracts = localStorage.getItem('@TelaAgil:contracts');

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
        contracts: [],
      };

      if (storagedProtocol) {
        customerServiceState.protocol = storagedProtocol;
      }

      if (storagedContracts) {
        customerServiceState.contracts = JSON.parse(storagedContracts);
      }

      return customerServiceState;
    }

    return {} as CustomerServiceState;
  });

  const findAllContracts = useCallback(
    async ({ stateCode, cpf }: FindAllContractsProps) => {
      const response = await eqtlBarApi.get('/atendimento/v1/clientes', {
        params: {
          cpf,
          flagDadosCliente: true,
          empresaOperadora: stateCode,
          codigoTransacao: uuid(),
        },
      });

      const contracts: Contract[] = response.data.data.cliente.map(
        (contract: any) => ({
          owner: `${contract.nome} ${contract.sobrenome}`,
          contractAccount: contract.contaContrato,
          address: {
            publicArea: contract.endereco.logradouro,
            number: contract.endereco.numero,
            neighborhood: contract.endereco.bairro,
            city: contract.endereco.cidade,
            uf: contract.endereco.uf,
            postalCode: contract.endereco.cep,
            referencePoint: contract.endereco.pontoReferencia,
          },
        }),
      );

      if (!contracts.length) {
        throw new Error();
      } else {
        localStorage.setItem('@TelaAgil:contracts', JSON.stringify(contracts));

        setCustomerServiceData({
          ...customerServiceData,
          contracts,
        });
      }
    },
    [customerServiceData],
  );

  const getCustomer = useCallback(
    async ({ stateCode, contract }: GetCustomerData) => {
      const response = await eqtlBarApi.get('/atendimento/v1/clientes', {
        params: {
          codigoTransacao: uuid(),
          contrato: contract,
          empresaOperadora: stateCode,
          flagDadosCliente: true,
          flagStatusInstalacao: true,
          flagPossuiDebitos: true,
          flagDadosTecnicos: true,
          flagNotasAbertas: true,
          flagNotasEncerradas: true,
          flagDetalheDebitoCobranca: true,
          flagDetalheDebitoFatura: true,
        },
      });

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
          contracts: [],
        }),
      );

      setCustomerServiceData({
        operatingCompany: stateCode,
        customer,
        installation,
        debits,
        serviceNotes,
        contracts: [],
      });
    },
    [],
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

      setCustomerServiceData(state => ({
        ...state,
        protocol: response.data.data.protocolo,
      }));
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
        customAlert({
          type: 'error',
          title: 'Erro no atendimento',
          description:
            'Ocorreu um erro ao iniciar o atendimento, cheque as informações do cliente',
          confirmationText: 'OK',
        });
      }
    },
    [getCustomer, generateProtocol, customAlert],
  );

  const saveAttendanceLog = useCallback(
    async (attendanceTime: string) => {
      await eqtlBarApi.post('/logs', {
        user_id: user.id,
        username: user.name,
        contractAccount: customerServiceData.customer.contractAccount,
        attendanceTime,
        services: servicesPerformed,
      });
    },
    [user, customerServiceData.customer, servicesPerformed],
  );

  const finishService = useCallback(
    async (attendanceTime: string) => {
      await saveAttendanceLog(attendanceTime);

      localStorage.removeItem('@TelaAgil:protocol');
      localStorage.removeItem('@TelaAgil:customerServiceData');

      setCustomerServiceData({} as CustomerServiceContextData);

      setServicesPerformed([]);

      setServiceStarted(false);
    },
    [saveAttendanceLog],
  );

  const registerServicePerformed = useCallback(
    ({ serviceName, executionDate }: ServicePerformed) => {
      setServicesPerformed(oldServices => [
        ...oldServices,
        { serviceName, executionDate },
      ]);
    },
    [],
  );

  return (
    <CustomerServiceContext.Provider
      value={{
        operatingCompany: customerServiceData.operatingCompany,
        protocol: customerServiceData.protocol,
        customer: customerServiceData.customer,
        installation: customerServiceData.installation,
        debits: customerServiceData.debits,
        serviceNotes: customerServiceData.serviceNotes,
        contracts: customerServiceData.contracts,
        serviceStarted,
        getCustomer,
        startService,
        finishService,
        registerServicePerformed,
        findAllContracts,
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
