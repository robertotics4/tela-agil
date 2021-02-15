import { AxiosResponse } from 'axios';
import { parseISO } from 'date-fns';

import Customer from '../types/Customer';
import Installation from '../types/Installation';

import { phoneMask } from './inputMasks';

import getInstallationSubclassName from './getInstallationSubclassName';

interface ExtractedData {
  customer: Customer;
  installation: Installation;
}

interface ResponsePhone {
  tipoTelefone: string;
  numeroTelefone: string;
}

function getCustomerData(response: AxiosResponse, stateCode: string): Customer {
  const responseCustomer = response.data.data.cliente[0];

  const customer: Customer = {
    contractAccount: responseCustomer.contaContrato,
    name: responseCustomer.nome,
    surname: responseCustomer.sobrenome,
    motherName: responseCustomer.nomeMae,
    dayOfBirth: parseISO(responseCustomer.dataNascimento),
    rg: responseCustomer.numeroRg,
    cpf: responseCustomer.numeroCpf,
    contacts: {
      email: responseCustomer.contatos.email,
    },
    address: {
      publicArea: responseCustomer.endereco.logradouro,
      number: responseCustomer.endereco.numero,
      neighborhood: responseCustomer.endereco.bairro,
      city: responseCustomer.endereco.cidade,
      uf: responseCustomer.endereco.uf,
      postalCode: responseCustomer.endereco.cep,
    },
    phaseNumber: Number(responseCustomer.numeroFases),
    bp: responseCustomer.bp,
    installationNumber: responseCustomer.numeroInstalacao,
  };

  if (stateCode === '82' || stateCode === '86') {
    customer.contractAccount = responseCustomer.contaContrato.toString();

    const landline = responseCustomer.contatos.telefones
      .filter(
        (telefone: ResponsePhone) =>
          telefone.numeroTelefone && telefone.tipoTelefone === 'R',
      )
      .map((telefone: ResponsePhone) => phoneMask(telefone.numeroTelefone));

    const cellPhone = responseCustomer.contatos.telefones
      .filter(
        (telefone: ResponsePhone) =>
          telefone.numeroTelefone && telefone.tipoTelefone === 'C',
      )
      .map((telefone: ResponsePhone) => phoneMask(telefone.numeroTelefone));

    customer.contacts = {
      phones: {
        landline,
        cellPhone,
      },
      email: responseCustomer.contatos.email,
    };

    customer.installationNumber = responseCustomer.numeroInstalacao.toString();

    customer.address.complement = responseCustomer.endereco.complemento;
  }

  return customer;
}

function getInstallationData(
  responseInstallation: any,
  stateCode: string,
): Installation {
  const {
    status,
    corteAndamento,
    desligaAndamento,
    faltaEnergiaIndividual,
    faltaEnergiaColetiva,
    desligamentoProgramado,
    faltaFases,
    faltaEnergiaAvaliacaoTecnica,
  } = responseInstallation;

  const {
    classe,
    subclasse,
    tarifa,
    grupoTensao,
    tipoPagamento,
    fase,
    localidade,
    bomPagador,
  } = responseInstallation.dadosTecnicos;

  const {
    latitude,
    longitude,
  } = responseInstallation.dadosTecnicos.coordenadaGeografica;

  const installation: Installation = {
    status,
    cutInProgress: true && corteAndamento === 'S',
    turnOffInProgress: true && desligaAndamento === 'S',
    individualPowerOutage: true && faltaEnergiaIndividual === 'S',
    collectivePowerOutage: true && faltaEnergiaColetiva === 'S',
    scheduledShutdown: true && desligamentoProgramado === 'S',
    powerPhaseOutage: true && faltaFases === 'S',
    powerOutageTechnicalEvaluation:
      true && faltaEnergiaAvaliacaoTecnica === 'S',
    technicalData: {
      class: classe,
      subclass: subclasse,
      tariff: tarifa,
      tensionGroup: grupoTensao,
      geographicCoordinates: {
        latitude,
        longitude,
      },
      paymentType: tipoPagamento,
      phase: Number(fase),
      locality: localidade,
      goodPayer: true && bomPagador === 'S',
    },
  };

  if (stateCode === '98' || stateCode === '95') {
    installation.technicalData.subclass = getInstallationSubclassName(
      installation.technicalData.subclass,
    );
  }

  return installation;
}

function extractResponseData(
  response: AxiosResponse,
  stateCode: string,
): ExtractedData {
  const { data: responseData } = response.data;

  const customer = getCustomerData(response, stateCode);

  const installation = getInstallationData(responseData.instalacao, stateCode);

  return {
    customer,
    installation,
  };
}

export default extractResponseData;
