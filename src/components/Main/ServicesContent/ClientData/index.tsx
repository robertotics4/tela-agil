import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { useCustomerService } from '../../../../hooks/customerService';

import { phoneMask } from '../../../../utils/inputMasks';

import { Container, Content } from './styles';

const ClientData: React.FC = () => {
  const { customer } = useCustomerService();

  const formattedDayOfBirth = useMemo(() => {
    return format(new Date(customer.dayOfBirth), 'dd/MM/yyyy');
  }, [customer.dayOfBirth]);

  const formattedAddress = useMemo(() => {
    const { address } = customer;
    return `${address.publicArea}, ${address.number} ${address.complement}, ${address.neighborhood}, ${address.city} - ${address.uf}, CEP: ${address.postalCode}. ${address.referencePoint}`;
  }, [customer]);

  const formattedLandlines = useMemo(() => {
    const landlines = customer.contacts.phones.landline.map((item, index) => {
      item = phoneMask(item);

      if (index > 0) {
        return `/ ${item}`;
      }

      return item;
    });

    return landlines;
  }, [customer.contacts.phones.landline]);

  const formattedCellPhones = useMemo(() => {
    const cellPhones = customer.contacts.phones.cellPhone.map((item, index) => {
      item = phoneMask(item);

      if (index > 0) {
        return ` / ${item}`;
      }

      return item;
    });

    return cellPhones;
  }, [customer.contacts.phones.cellPhone]);

  return (
    <Container>
      <h3>Dados do cliente</h3>

      <Content>
        <div>
          <label>
            NOME COMPLETO
            <p>{customer.name}</p>
          </label>

          <label>
            FATURA POR E-MAIL
            <p>{customer.emailInvoice ? 'Sim' : 'Não'}</p>
          </label>

          <label>
            CPF
            <p>{customer.cpf}</p>
          </label>

          <label>
            RG
            <p>{customer.rg}</p>
          </label>

          <label>
            DATA DE NASCIMENTO
            <p>{formattedDayOfBirth}</p>
          </label>

          <label>
            PN
            <p>{customer.pn}</p>
          </label>

          <label>
            ENDEREÇO DO CLIENTE
            <p>{formattedAddress}</p>
          </label>
        </div>

        <div>
          <label>
            PERFIL DO CLIENTE
            <p>{customer.profile}</p>
          </label>

          <label>
            TIPO DO PN
            <p>{customer.pnType}</p>
          </label>

          <label>
            CONTRATO(S) ATIVO(S)
            <p>{customer.numberOfActiveContracts}</p>
          </label>

          <label>
            APTO A NEGOCIAR
            <p>{customer.ableToNegotiate ? 'Sim' : 'Não'}</p>
          </label>

          <label>
            CELULAR
            <p>{formattedCellPhones}</p>
          </label>

          <label>
            FIXO
            <p>{formattedLandlines}</p>
          </label>

          <label>
            E-MAIL
            <p>{customer.contacts.email}</p>
          </label>
        </div>
      </Content>
    </Container>
  );
};

export default ClientData;
