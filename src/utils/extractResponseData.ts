import { AxiosResponse } from 'axios';
import { parseISO } from 'date-fns';

import Customer from '../types/Customer';

interface ExtractedData {
  customer: Customer;
}

interface ResponsePhone {
  tipoTelefone: string;
  numeroTelefone: string;
}

function extractResponseData(response: AxiosResponse): ExtractedData {
  const { data: responseData } = response.data;
  const { cliente } = responseData;
  const { endereco } = cliente[0];
  const { contatos } = cliente[0];

  const landline = contatos.telefones
    .filter(
      (telefone: ResponsePhone) =>
        telefone.numeroTelefone && telefone.tipoTelefone === 'R',
    )
    .map((telefone: ResponsePhone) => telefone.numeroTelefone);

  const cellPhone = contatos.telefones
    .filter(
      (telefone: ResponsePhone) =>
        telefone.numeroTelefone && telefone.tipoTelefone === 'C',
    )
    .map((telefone: ResponsePhone) => telefone.numeroTelefone);

  const customer: Customer = {
    name: cliente[0].nome,
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

  return { customer };
}

export default extractResponseData;
