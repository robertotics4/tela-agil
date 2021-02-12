import { AxiosResponse } from 'axios';
import { parseISO } from 'date-fns';

import Customer from '../types/Customer';
import Contract from '../types/Contract';
import Installation from '../types/Installation';

interface ExtractedData {
  customer: Customer;
}

interface ResponsePhone {
  tipoTelefone: string;
  numeroTelefone: string;
}

function getInstallationData(
  responseInstallation: any,
  stateCode: string,
): Installation {
  console.log(responseInstallation);

  const installation: Installation = {
    status: responseInstallation.status,
    cutInProgress: true && responseInstallation.corteAndamento === 'S',
    turnOffInProgress: true && responseInstallation.desligaAndamento === 'S',
    individualPowerOutage:
      true && responseInstallation.faltaEnergiaIndividual === 'S',
    collectivePowerOutage:
      true && responseInstallation.faltaEnergiaColetiva === 'S',
    scheduledShutdown:
      true && responseInstallation.desligamentoProgramado === 'S',
    powerPhaseOutage: true && responseInstallation.faltaFases === 'S',
    powerOutageTechnicalEvaluation:
      true && responseInstallation.faltaEnergiaAvaliacaoTecnica === 'S',
    technicalData: {
      class: responseInstallation.dadosTecnicos.classe,
      subclass: responseInstallation.dadosTecnicos.subclasse,
      tariff: responseInstallation.dadosTecnicos.tarifa,
      tensionGroup: responseInstallation.dadosTecnicos.grupoTensao,
      geographicCoordinates: {
        latitude: responseInstallation.coordenadaGeografica.latitude,
        longitude: responseInstallation.coordenadaGeografica.longitude,
      },
      paymentType: responseInstallation.dadosTecnicos.tipoPagamento,
      phase: Number(responseInstallation.dadosTecnicos.fase),
      locality: responseInstallation.dadosTecnicos.localidade,
      goodPayer: true && responseInstallation.dadosTecnicos.bomPagador === 'S',
    },
  };

  return installation;
}

function extractResponseData(
  response: AxiosResponse,
  stateCode: string,
): ExtractedData {
  const { data: responseData } = response.data;
  const { cliente } = responseData;
  const { instalacao } = responseData;
  const { dadosTecnicos } = instalacao;
  const { endereco } = cliente[0];
  const { contatos } = cliente[0];

  let customer: Customer = {} as Customer;
  const contract: Contract = {} as Contract;
  let landline: any = [];
  let cellPhone: any = [];

  if (stateCode === '82' || stateCode === '86') {
    landline = contatos.telefones
      .filter(
        (telefone: ResponsePhone) =>
          telefone.numeroTelefone && telefone.tipoTelefone === 'R',
      )
      .map((telefone: ResponsePhone) => telefone.numeroTelefone);

    cellPhone = contatos.telefones
      .filter(
        (telefone: ResponsePhone) =>
          telefone.numeroTelefone && telefone.tipoTelefone === 'C',
      )
      .map((telefone: ResponsePhone) => telefone.numeroTelefone);

    customer = {
      name: cliente[0].nome,
      surname: cliente[0].sobrenome,
      emailInvoice: false, // Hard coded
      cpf: cliente[0].numeroCpf,
      rg: cliente[0].numeroRg,
      dayOfBirth: parseISO(cliente[0].dataNascimento),
      pn: '', // Hard coded
      address: {
        publicArea: endereco.logradouro,
        number: endereco.numero,
        neighborhood: endereco.bairro,
        city: endereco.cidade,
        uf: endereco.uf,
        postalCode: endereco.cep,
        referencePoint: endereco.pontoReferencia,
      },
      profile: 'PF', // Hard coded
      pnType: '',
      numberOfActiveContracts: responseData.numeroContasContratosAtivas,
      ableToNegotiate: false, // hardCoded
      contacts: {
        phones: {
          landline,
          cellPhone,
        },
        email: contatos.email,
      },
    };
  } else {
    customer = {
      name: cliente[0].nome,
      surname: cliente[0].sobrenome,
      emailInvoice: false, // Hard coded
      cpf: cliente[0].numeroCpf,
      rg: cliente[0].numeroRg,
      dayOfBirth: parseISO(cliente[0].dataNascimento),
      pn: '', // Hard coded
      address: {
        publicArea: endereco.logradouro,
        number: endereco.numero,
        complement: endereco.complemento,
        neighborhood: endereco.bairro,
        city: endereco.cidade,
        uf: endereco.uf,
        postalCode: endereco.cep,
        referencePoint: endereco.pontoReferencia,
      },
      profile: 'PF', // Hard coded
      pnType: '',
      numberOfActiveContracts: Number(responseData.numeroContasContratosAtivas),
      ableToNegotiate: false, // hardCoded
      contacts: {
        phones: {
          landline,
          cellPhone,
        },
        email: contatos.email,
      },
    };

    // contract = {
    //   installationNumber: cliente[0].numeroInstalacao,
    //   class: dadosTecnicos.classe,
    //   installationStatus: instalacao.status,
    //   contractStatus: 'Ativa', // Hard coded
    //   lowIncome: dadosTecnicos.subclasse,
    //   irregularConsumption: false, // Hard coded
    //   scheduledShutdown: instalacao.desligamentoProgramado,
    //   averageConsumption: 0, // Hard coded
    // };
  }

  return { customer };
}

export default extractResponseData;
