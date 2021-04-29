import React, { createContext, useCallback, useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Swal from 'sweetalert2';

import { useAuth } from './auth';

import Customer from '../types/Customer';
import Installation from '../types/Installation';
import Debits from '../types/Debits';

import {
  extractResponseData,
  getInstallationData,
  getServiceNotes,
} from '../utils/extractResponseData';

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
  contractAccount: string;
}

interface StartServiceProps {
  stateCode: string;
  contractAccount: string;
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
  fetchServiceData(customerData: GetCustomerData): Promise<void>;
  fetchInstallationData({
    contractAccount,
    operatingCompany,
  }: FetchInstallationDataProps): Promise<void>;
  startService({
    stateCode,
    contractAccount,
  }: StartServiceProps): Promise<void>;
  finishService(attendanceTime: string): Promise<void>;
  registerServicePerformed({
    serviceName,
    executionDate,
  }: ServicePerformed): void;
  findAllContracts({
    stateCode,
    cpf,
  }: FindAllContractsProps): Promise<Contract[]>;
}

interface GenerateProtocolProps {
  operatingCompany: string;
  contractAccount: string;
}

interface FindAllContractsProps {
  stateCode: string;
  cpf: string;
}

interface FetchInstallationDataProps {
  contractAccount: string;
  operatingCompany: string;
}

interface ServicePerformed {
  serviceName: string;
  executionDate: Date;
}

interface Contract {
  contractAccount: string;
  address: Address;
}

const CustomerServiceContext = createContext<CustomerServiceContextData>(
  {} as CustomerServiceContextData,
);

const CustomerServiceProvider: React.FC = ({ children }) => {
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
          contractAccount:
            typeof contract.contaContrato === 'string'
              ? contract.contaContrato.replace(/^0+/, '')
              : contract.contaContrato.toString().replace(/^0+/, ''),
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
        setCustomerServiceData({
          ...customerServiceData,
          operatingCompany: stateCode,
          contracts,
        });

        return contracts;
      }
    },
    [customerServiceData],
  );

  const fetchServiceData = useCallback(
    async ({ stateCode, contractAccount }: GetCustomerData) => {
      const response = await eqtlBarApi.get('/atendimento/v1/clientes', {
        params: {
          codigoTransacao: uuid(),
          contrato: contractAccount,
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
    async ({ operatingCompany, contractAccount }: GenerateProtocolProps) => {
      const response = await eqtlBarApi.get('/atendimento/v1/clientes', {
        params: {
          empresaOperadora: operatingCompany,
          contrato: contractAccount,
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

  const fetchInstallationData = useCallback(
    async ({
      contractAccount,
      operatingCompany,
    }: FetchInstallationDataProps) => {
      const response = await eqtlBarApi.get('/atendimento/v1/clientes', {
        params: {
          codigoTransacao: uuid(),
          contrato: contractAccount,
          empresaOperadora: operatingCompany,
          flagStatusInstalacao: true,
          flagDadosTecnicos: true,
          flagNotasAbertas: true,
          flagNotasEncerradas: true,
        },
      });

      const responseInstallationData = response.data.data.instalacao;

      const installationData = getInstallationData(
        responseInstallationData,
        operatingCompany,
      );

      const serviceNotesData = getServiceNotes(response);

      setCustomerServiceData({
        ...customerServiceData,
        installation: installationData,
        serviceNotes: serviceNotesData,
      });

      localStorage.setItem(
        '@TelaAgil:customerServiceData',
        JSON.stringify({
          ...customerServiceData,
          installation: installationData,
          serviceNotes: serviceNotesData,
        }),
      );
    },
    [customerServiceData],
  );

  const startService = useCallback(
    async ({ stateCode, contractAccount }: StartServiceProps) => {
      const formattedContractAccount = contractAccount.replace(/^0+/, '');

      try {
        await fetchServiceData({
          stateCode,
          contractAccount: formattedContractAccount,
        });

        await generateProtocol({
          contractAccount: formattedContractAccount,
          operatingCompany: stateCode,
        });

        setServiceStarted(true);
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Erro no atendimento',
          html:
            '<p>Ocorreu um erro ao iniciar o atendimento, cheque as informações do cliente</p>',
          confirmButtonText: `OK`,
          confirmButtonColor: '#3c1490',
        });
      }
    },
    [fetchServiceData, generateProtocol],
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
      localStorage.removeItem('@TelaAgil:contracts');
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
        fetchServiceData,
        fetchInstallationData,
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
