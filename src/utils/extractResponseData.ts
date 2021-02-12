import { AxiosResponse } from 'axios';
import { parseISO } from 'date-fns';

import Customer from '../types/Customer';

import validateStringDate from './validateStringDate';

interface ExtractedData {
  customer: Customer;
}

interface ResponsePhone {
  tipoTelefone: string;
  numeroTelefone: string;
}

function extractResponseData(
  response: AxiosResponse,
  stateCode: string,
): ExtractedData {
  const { data: responseData } = response.data;
  const { cliente } = responseData;
  const { endereco } = cliente[0];
  const { contatos } = cliente[0];

  let customer: Customer = {} as Customer;
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
  }

  return { customer };
}

export default extractResponseData;
