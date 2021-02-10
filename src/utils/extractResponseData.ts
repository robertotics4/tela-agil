import { AxiosResponse } from 'axios';
import { parseISO } from 'date-fns';

import Customer from '../types/Customer';
import { Phone } from '../types/Contacts';

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

  const phones: Phone[] = contatos.telefones.map((phone: ResponsePhone) => {
    const mappedPhone: Phone = {
      type: phone.tipoTelefone,
      number: phone.numeroTelefone,
    };

    return mappedPhone;
  });

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
      phones,
      email: contatos.email,
    },
  };

  return { customer };
}

export default extractResponseData;
