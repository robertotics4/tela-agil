import { AxiosResponse } from 'axios';
import { parseISO } from 'date-fns';

import Customer from '../types/Customer';
import Installation from '../types/Installation';
import Debits, { InvoiceDebit, InstallmentDebit } from '../types/Debits';
import ServiceNotes, { OpenNote, ClosedNote } from '../types/ServiceNotes';

import { phoneMask } from './inputMasks';

import getInstallationSubclassName from './getInstallationSubclassName';

interface ExtractedData {
  customer: Customer;
  installation: Installation;
  debits: Debits;
  serviceNotes: ServiceNotes;
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

function getDebits(responseDebits: any, stateCode: string): Debits {
  const { debitosFatura, debitosParcelamento } = responseDebits;

  const invoiceDebits: InvoiceDebit[] = debitosFatura.detalhesDebitoFatura.map(
    (debit: any) => {
      return {
        overdueInvoiceNumber: debit.numeroFaturaVencida,
        dueDate: parseISO(debit.dataVencimento),
        invoiceAmount: Number(debit.valorFatura),
        invoiceReference: debit.referenciaFatura,
        paymentCode: debit.codigoPagamento,
      };
    },
  );

  const installmentDebits: InstallmentDebit[] = debitosParcelamento.detalhesDebitoParcelamento.map(
    (debit: any) => {
      const parsedDebit: InstallmentDebit = {
        billingDocumentNumber: debit.numeroDocumentoCobranca,
        invoiceAmount: Number(debit.valorFatura.toString().trim()),
        invoiceReference: '',
        paymentCode: debit.codigoPagamento,
      };

      if (stateCode === '82' || stateCode === '86') {
        parsedDebit.invoiceReference = debit.referenciaFatura;
      }

      return parsedDebit;
    },
  );

  const debits: Debits = {
    invoiceDebits: {
      invoiceDebitDetails: invoiceDebits,
      totalAmountInvoiceDebits: Number(debitosFatura.valorTotalDebitoFatura),
    },
    installmentDebits: {
      installmentDebitDetails: installmentDebits,
      totalAmountInstallmentDebits: Number(
        debitosParcelamento.valorTotalDebitoParcelamento,
      ),
    },
  };

  return debits;
}

function getServiceNotes(response: AxiosResponse): ServiceNotes {
  const responseNotes = response.data.data.notas;

  const mappedOpenServiceNotes: OpenNote[] = responseNotes.notasAbertas.map(
    (note: any) => {
      const openServiceNote: OpenNote = {
        type: note.tipoNota,
        typeDescription: note.descricaoTipoNota,
        codeGroup: note.grupoCode,
        codeGroupDescription: note.descricaoGrupoCode,
        code: note.code,
        codeDescription: note.descricaoCode,
        openingDate: parseISO(note.dataAbertura),
        status: note.status,
        rejectionCode: note.codigoRejeicao,
        rejectionCodeDescription: note.descricaoCodigoRejeicao,
      };

      return openServiceNote;
    },
  );

  const mappedClosedServiceNotes: ClosedNote[] = responseNotes.notasEncerradas.map(
    (note: any) => {
      const openServiceNote: ClosedNote = {
        type: note.tipoNota,
        typeDescription: note.descricaoNota,
        codeGroup: note.grupoCode,
        codeGroupDescription: note.descricaoGrupoCode,
        code: note.code,
        codeDescription: note.descricaoCode,
        openingDate: parseISO(note.dataAbertura),
        conclusionDate: parseISO(note.dataConclusao),
      };

      return openServiceNote;
    },
  );

  const serviceNotes: ServiceNotes = {
    openServiceNotes: mappedOpenServiceNotes,
    closedServiceNotes: mappedClosedServiceNotes,
  };

  return serviceNotes;
}

function extractResponseData(
  response: AxiosResponse,
  stateCode: string,
): ExtractedData {
  const { data: responseData } = response.data;

  const customer = getCustomerData(response, stateCode);
  const installation = getInstallationData(responseData.instalacao, stateCode);
  const debits = getDebits(responseData.debitos, stateCode);
  const serviceNotes = getServiceNotes(response);

  return {
    customer,
    installation,
    debits,
    serviceNotes,
  };
}

export { extractResponseData, getInstallationData };
